import { describe, expect, it, vi } from 'vitest';
import {
  ETIQUETA_SIN_VERIFICAR,
  GuardiaPreEnvio,
  similitudCoseno,
  UMBRAL_DERIVA_POR_DEFECTO,
} from '../guardia';
import {
  componerPromptDelSistema,
  MARCA_RESTRICCION_LENGUAS,
  RESTRICCION_LENGUAS_ASISTENTE,
} from '../asistente';
import { GrafoTraduccionNativa, type FuncionTraduccion } from '../grafo';
import { LEXICO_INTERFAZ } from '../lexico';
import { descriptorLengua, esLenguaSoportada, LENGUAS, LENGUAS_CLAVES } from '../lenguas';
import { PerfilIdiolectal, PERFIL_NEUTRO } from '../perfil';
import {
  coberturaPorLengua,
  interpolar,
  resolverTexto,
  validarRegistroTraduccion,
} from '../registro';
import type { EntradaLexica } from '../tipos';

describe('similitudCoseno', () => {
  it('devuelve 1 para vectores idénticos y 0 para ortogonales', () => {
    expect(similitudCoseno([1, 2, 3], [1, 2, 3])).toBeCloseTo(1, 10);
    expect(similitudCoseno([1, 0], [0, 1])).toBeCloseTo(0, 10);
  });

  it('nunca aprueba por accidente con vectores degenerados', () => {
    expect(similitudCoseno([], [])).toBe(0);
    expect(similitudCoseno([0, 0], [1, 1])).toBe(0);
    expect(similitudCoseno([1, 2], [1, 2, 3])).toBe(0);
    expect(similitudCoseno([Number.NaN, 1], [1, 1])).toBe(0);
  });
});

describe('GuardiaPreEnvio · filtro de deriva', () => {
  it('rechaza umbrales fuera de (0, 1]', () => {
    expect(() => new GuardiaPreEnvio(0)).toThrow(/UMBRAL_DERIVA_INVALIDO/);
    expect(() => new GuardiaPreEnvio(1.2)).toThrow(/UMBRAL_DERIVA_INVALIDO/);
  });

  it('aprueba en el umbral exacto y reprueba por debajo', () => {
    const guardia = new GuardiaPreEnvio(0.85);
    expect(guardia.medirDeriva([1, 0], [1, 0]).aprueba).toBe(true);
    expect(guardia.medirDeriva([1, 0], [0, 1])).toMatchObject({
      aprueba: false,
      razones: ['DERIVA_SEMANTICA_FUERA_DE_UMBRAL'],
    });
  });
});

describe('GuardiaPreEnvio · política de publicación', () => {
  const guardia = new GuardiaPreEnvio();

  it('solo publica sin etiqueta lo verificado', () => {
    const veredicto = guardia.evaluarPublicacion({
      texto: 'Haux',
      estado: 'VERIFICADO',
      origen: 'HABLANTE_NATIVO',
      fuente: 'Revisión de hablante registrada en acta',
      revisadoEn: '2026-09-12',
    });
    expect(veredicto.decision).toBe('PUBLICAR');
    expect(veredicto.etiqueta).toBeUndefined();
  });

  it('etiqueta lo no verificado en vez de ocultarlo o pasarlo como bueno', () => {
    expect(
      guardia.evaluarPublicacion({
        texto: 'Haux',
        estado: 'POR_VERIFICAR',
        origen: 'SIN_TRAZABILIDAD',
        fuente: 'heredada',
      }),
    ).toMatchObject({ decision: 'PUBLICAR_ETIQUETADO', etiqueta: ETIQUETA_SIN_VERIFICAR });
  });

  it('retiene lo rechazado, lo vacío y lo inexistente', () => {
    expect(
      guardia.evaluarPublicacion({
        texto: 'Ayuda',
        estado: 'RECHAZADO',
        origen: 'SIN_TRAZABILIDAD',
        fuente: 'es español',
        revisadoEn: '2026-09-12',
      }).decision,
    ).toBe('RETENER');
    expect(
      guardia.evaluarPublicacion({
        texto: '   ',
        estado: 'VERIFICADO',
        origen: 'HABLANTE_NATIVO',
        fuente: 'x',
        revisadoEn: '2026-09-12',
      }).decision,
    ).toBe('RETENER');
    expect(guardia.evaluarPublicacion(undefined).decision).toBe('RETENER');
  });

  it('la decisión de publicar no depende de ningún embedding', () => {
    // Invariante del subsistema: la política es determinística. `evaluarPublicacion`
    // no recibe vectores, así que una similitud alta jamás puede promover una
    // traducción que nadie revisó.
    expect(guardia.evaluarPublicacion.length).toBe(1);
    const alta = guardia.medirDeriva([1, 0], [1, 0]);
    expect(alta.aprueba).toBe(true);
    expect(
      guardia.evaluarPublicacion({
        texto: 'texto de máquina',
        estado: 'POR_VERIFICAR',
        origen: 'MAQUINA',
        fuente: 'borrador del grafo',
      }).decision,
    ).toBe('PUBLICAR_ETIQUETADO');
  });
});

describe('Registro de traducción v0.1', () => {
  it('el léxico embarcado es estructuralmente válido', () => {
    expect(validarRegistroTraduccion()).toEqual({ valid: true, errors: [] });
  });

  it('impide que una máquina o una cadena sin autor queden como VERIFICADO', () => {
    const entradas: EntradaLexica[] = [
      {
        clave: 'prueba.maquina',
        es: 'Inicio',
        glosa: 'prueba',
        traducciones: {
          wixarika: {
            texto: 'Haux',
            estado: 'VERIFICADO',
            origen: 'MAQUINA',
            fuente: 'modelo',
            revisadoEn: '2026-09-12',
          },
        },
      },
    ];
    expect(validarRegistroTraduccion(entradas).errors).toContain(
      'VERIFICADO_SIN_REVISION_HUMANA:prueba.maquina:wixarika',
    );
  });

  it('detecta marcadores inventados que se pintarían literales en pantalla', () => {
    const entradas: EntradaLexica[] = [
      {
        clave: 'prueba.marcador',
        es: 'Hola, {nombre}',
        glosa: 'prueba',
        traducciones: {
          cora: {
            texto: "Tyu'un, {monto}",
            estado: 'POR_VERIFICAR',
            origen: 'SIN_TRAZABILIDAD',
            fuente: 'heredada',
          },
        },
      },
    ];
    expect(validarRegistroTraduccion(entradas).errors).toContain(
      'MARCADOR_DESCONOCIDO:prueba.marcador:cora:monto',
    );
  });

  it('exige motivo y fecha para rechazar, en vez de borrar en silencio', () => {
    const entradas: EntradaLexica[] = [
      {
        clave: 'prueba.rechazo',
        es: 'Ayuda',
        glosa: 'prueba',
        traducciones: {
          cora: {
            texto: 'Ayuda',
            estado: 'RECHAZADO',
            origen: 'SIN_TRAZABILIDAD',
            fuente: 'idéntica al español',
          },
        },
      },
    ];
    expect(validarRegistroTraduccion(entradas).errors).toContain(
      'RECHAZADO_SIN_FECHA:prueba.rechazo:cora',
    );
    expect(
      validarRegistroTraduccion([
        {
          ...entradas[0],
          traducciones: {
            cora: { ...entradas[0].traducciones.cora!, fuente: '' },
          },
        },
      ]).errors,
    ).toContain('FUENTE_REQUERIDA:prueba.rechazo:cora');
  });
});

describe('resolverTexto', () => {
  it('entrega español sin etiqueta cuando la lengua base es la pedida', () => {
    const resuelto = resolverTexto('nav.inicio', 'es');
    expect(resuelto).toMatchObject({
      texto: 'Inicio',
      lenguaEfectiva: 'es',
      decision: 'PUBLICAR',
    });
    expect(resuelto.etiqueta).toBeUndefined();
  });

  it('entrega la traducción heredada pero siempre etiquetada', () => {
    const resuelto = resolverTexto('nav.inicio', 'wixarika');
    expect(resuelto).toMatchObject({
      texto: 'Haux',
      lenguaEfectiva: 'wixarika',
      estado: 'POR_VERIFICAR',
      decision: 'PUBLICAR_ETIQUETADO',
      etiqueta: ETIQUETA_SIN_VERIFICAR,
    });
  });

  it('cae a español, y lo dice, cuando la cadena está rechazada', () => {
    const resuelto = resolverTexto('accion.ayuda', 'cora');
    expect(resuelto.texto).toBe('Ayuda');
    expect(resuelto.lenguaEfectiva).toBe('es');
    expect(resuelto.lenguaSolicitada).toBe('cora');
    expect(resuelto.razones).toContain('REPLIEGUE_A_ESPANOL');
  });

  it('cae a español cuando la cadena náayeri se copió al bloque wixárika', () => {
    expect(resolverTexto('nav.redes', 'wixarika').lenguaEfectiva).toBe('es');
    expect(resolverTexto('nav.redes', 'cora').lenguaEfectiva).toBe('cora');
  });

  it('interpola el nombre del perfil en todas las lenguas', () => {
    expect(resolverTexto('app.saludo', 'es', { valores: { nombre: 'Ana' } }).texto).toBe(
      'Hola, Ana',
    );
    expect(resolverTexto('app.saludo', 'cora', { valores: { nombre: 'Ana' } }).texto).toBe(
      "Tyu'un, Ana",
    );
  });

  it('conserva el marcador {nombre} en toda lengua: el encabezado parte por ahí', () => {
    // CitizenApp pinta el nombre resaltado aparte y separa la plantilla por
    // el marcador. Partir por coma duplicaba el nombre en wixárika, que
    // saluda sin coma.
    for (const lengua of LENGUAS_CLAVES) {
      const plantilla = resolverTexto('app.saludo', lengua).texto;
      expect(plantilla.split('{nombre}')).toHaveLength(2);
    }
  });

  it('no revienta la interfaz ante una clave inexistente', () => {
    expect(resolverTexto('clave.que.no.existe', 'cora')).toMatchObject({
      decision: 'RETENER',
      lenguaEfectiva: 'es',
    });
  });
});

describe('Cobertura declarable', () => {
  it('mide cobertura real por lengua sobre todo el léxico', () => {
    const cobertura = coberturaPorLengua();
    expect(cobertura.map((c) => c.lengua)).toEqual(['cora', 'wixarika']);
    for (const lengua of cobertura) {
      expect(lengua.total).toBe(LEXICO_INTERFAZ.length);
      expect(
        lengua.verificadas + lengua.porVerificar + lengua.rechazadas + lengua.sinTraduccion,
      ).toBe(lengua.total);
    }
  });

  it('ninguna cadena embarcada se presenta hoy como verificada', () => {
    // Si esta prueba falla es porque alguien marcó VERIFICADO: debe venir
    // acompañada del acta de revisión del hablante, y esta expectativa se
    // actualiza en el mismo PR.
    expect(coberturaPorLengua().every((lengua) => lengua.verificadas === 0)).toBe(true);
  });
});

describe('Catálogo de lenguas', () => {
  it('usa el autónimo en pantalla aunque la clave interna sea el exónimo', () => {
    expect(descriptorLengua('cora')).toMatchObject({
      autonimo: 'Náayeri',
      etiquetaBoton: 'NÁAYERI',
    });
  });

  it('declara que ninguna lengua originaria tiene voz sintética propia', () => {
    const originarias = LENGUAS.filter((lengua) => lengua.clave !== 'es');
    expect(originarias.every((lengua) => lengua.vozNativa === false)).toBe(true);
    expect(originarias.every((lengua) => lengua.localeVoz === 'es-MX')).toBe(true);
  });

  it('valida claves de lengua venidas de la URL o del estado guardado', () => {
    expect(esLenguaSoportada('wixarika')).toBe(true);
    expect(esLenguaSoportada('en')).toBe(false);
  });
});

describe('PerfilIdiolectal', () => {
  it('normaliza hertz y palabras por minuto a parámetros de Web Speech', () => {
    expect(PERFIL_NEUTRO.aParametrosDeVoz()).toEqual({ rate: 1, pitch: 1 });
    expect(
      new PerfilIdiolectal({ pitchHz: 180, tempoPpm: 180, terminosLocales: [] }).aParametrosDeVoz(),
    ).toEqual({ rate: 1.2, pitch: 1.5 });
  });

  it('acota valores extremos en vez de producir una voz inusable', () => {
    const extremo = new PerfilIdiolectal({
      pitchHz: 900,
      tempoPpm: 900,
      terminosLocales: [],
    });
    expect(extremo.aParametrosDeVoz()).toEqual({ rate: 1.6, pitch: 1.8 });
  });

  it('rechaza mediciones imposibles', () => {
    expect(
      () => new PerfilIdiolectal({ pitchHz: 0, tempoPpm: 150, terminosLocales: [] }),
    ).toThrow(/PITCH_INVALIDO/);
    expect(
      () => new PerfilIdiolectal({ pitchHz: 120, tempoPpm: -1, terminosLocales: [] }),
    ).toThrow(/TEMPO_INVALIDO/);
  });

  it('lleva los modismos del hablante a la instrucción de estilo', () => {
    const perfil = new PerfilIdiolectal({
      pitchHz: 120,
      tempoPpm: 140,
      terminosLocales: ['ándale', 'órale'],
    });
    expect(perfil.aContextoDePrompt()).toContain('140 palabras por minuto');
    expect(perfil.aContextoDePrompt()).toContain('ándale, órale');
  });
});

describe('GrafoTraduccionNativa', () => {
  const vectores: Record<string, number[]> = {
    'Reportar un bache': [1, 0, 0],
    fiel: [0.99, 0.1, 0],
    alucinado: [0, 1, 0],
    literal: [0.95, 0.2, 0],
  };
  const embed = (texto: string) => vectores[texto] ?? [0, 0, 1];

  it('emite el borrador con estilo cuando no hay deriva', async () => {
    const traducir = vi.fn<FuncionTraduccion>(() => 'fiel');
    const grafo = new GrafoTraduccionNativa();
    const candidato = await grafo.ejecutar({
      textoFuente: 'Reportar un bache',
      lengua: 'wixarika',
      embed,
      traducir,
    });

    expect(candidato.textoSalida).toBe('fiel');
    expect(candidato.aprobóFiltroDeriva).toBe(true);
    expect(candidato.replegado).toBe(false);
    expect(traducir).toHaveBeenCalledTimes(1);
    expect(traducir.mock.calls[0][2].temperatura).toBe(0.1);
  });

  it('descarta el borrador alucinado y replegar a literal con temperatura 0', async () => {
    const traducir = vi.fn<FuncionTraduccion>((_texto, _destino, opciones) =>
      opciones.instruccion.startsWith('Traducción literal') ? 'literal' : 'alucinado',
    );
    const grafo = new GrafoTraduccionNativa();
    const candidato = await grafo.ejecutar({
      textoFuente: 'Reportar un bache',
      lengua: 'cora',
      embed,
      traducir,
    });

    expect(candidato.textoSalida).toBe('literal');
    expect(candidato.replegado).toBe(true);
    expect(candidato.razones).toContain('DERIVA_SEMANTICA_FUERA_DE_UMBRAL');
    expect(candidato.razones).toContain('REPLIEGUE_A_TRADUCCION_LITERAL');
    expect(traducir.mock.calls[1][2].temperatura).toBe(0);
  });

  it('replega también cuando el vectorizador falla: no medir no es aprobar', async () => {
    const traducir = vi.fn<FuncionTraduccion>((_texto, _destino, opciones) =>
      opciones.instruccion.startsWith('Traducción literal') ? 'literal' : 'fiel',
    );
    const grafo = new GrafoTraduccionNativa();
    const candidato = await grafo.ejecutar({
      textoFuente: 'Reportar un bache',
      lengua: 'cora',
      embed: () => {
        throw new Error('servicio de embeddings caído');
      },
      traducir,
    });

    expect(candidato.razones).toContain('DERIVA_NO_MEDIBLE');
    expect(candidato.replegado).toBe(true);
    expect(candidato.aprobóFiltroDeriva).toBe(false);
  });

  it('inyecta el perfil idiolectal en la instrucción de estilo', async () => {
    const traducir = vi.fn<FuncionTraduccion>(() => 'fiel');
    await new GrafoTraduccionNativa().ejecutar({
      textoFuente: 'Reportar un bache',
      lengua: 'wixarika',
      embed,
      traducir,
      perfil: new PerfilIdiolectal({ pitchHz: 130, tempoPpm: 160, terminosLocales: ['ándale'] }),
    });
    expect(traducir.mock.calls[0][2].instruccion).toContain('160 palabras por minuto');
    expect(traducir.mock.calls[0][2].instruccion).toContain('ándale');
  });

  it('ninguna salida del grafo es publicable por sí sola', async () => {
    const grafo = new GrafoTraduccionNativa();
    for (const salida of ['fiel', 'alucinado', '']) {
      const candidato = await grafo.ejecutar({
        textoFuente: 'Reportar un bache',
        lengua: 'wixarika',
        embed,
        traducir: () => salida,
      });
      expect(candidato.aptoParaPublicacion).toBe(false);
      expect(candidato.estadoPropuesto).toBe('POR_VERIFICAR');
    }
  });

  it('LÍMITE MEDIDO: el filtro vectorial aprueba el paso directo del español', async () => {
    // cosine(x, x) = 1 es una identidad matemática: se cumple con CUALQUIER
    // función de embedding, incluida una real. Es decir, un modelo que no
    // traduce y devuelve el español tal cual pasa el filtro con puntaje
    // perfecto. Es exactamente el defecto que traían las cadenas heredadas
    // ("Ayuda" -> "Ayuda"), y el filtro de deriva es estructuralmente incapaz
    // de detectarlo.
    const guardia = new GuardiaPreEnvio(0.85);
    const identico = guardia.medirDeriva(embed('Reportar un bache'), embed('Reportar un bache'));
    expect(identico.similitud).toBeCloseTo(1, 10);
    expect(identico.aprueba).toBe(true);

    const candidato = await new GrafoTraduccionNativa().ejecutar({
      textoFuente: 'Reportar un bache',
      lengua: 'wixarika',
      embed,
      traducir: (fuente) => fuente, // el modelo no traduce: devuelve el español
    });
    expect(candidato.aprobóFiltroDeriva).toBe(true);
    expect(candidato.aptoParaPublicacion).toBe(false);

    // Lo que sí lo detiene es el registro, no el coseno. Por eso la política
    // de publicación no puede depender del filtro vectorial.
    expect(resolverTexto('accion.ayuda', 'cora').lenguaEfectiva).toBe('es');
  });

  it('le dice al traductor a qué lengua, con su norma y su variante', async () => {
    // Sin destino explícito la instrucción pide "traduce" sin decir a qué, y el
    // modelo devuelve normalmente el español de entrada — que además aprueba el
    // filtro de deriva con puntaje perfecto (ver LÍMITE MEDIDO).
    const traducir = vi.fn<FuncionTraduccion>(() => 'fiel');
    await new GrafoTraduccionNativa().ejecutar({
      textoFuente: 'Reportar un bache',
      lengua: 'wixarika',
      embed,
      traducir,
      normaOrtografica: 'norma declarada por la instancia revisora',
      variante: 'variante declarada por la comunidad',
    });

    const destino = traducir.mock.calls[0][1];
    expect(destino.lengua).toBe('wixarika');
    expect(destino.nombre).toBe('wixárika');
    expect(destino.normaOrtografica).toBe('norma declarada por la instancia revisora');
    expect(destino.variante).toBe('variante declarada por la comunidad');
  });

  it('marca el candidato cuando se preparó sin norma ortográfica declarada', async () => {
    const candidato = await new GrafoTraduccionNativa().ejecutar({
      textoFuente: 'Reportar un bache',
      lengua: 'cora',
      embed,
      traducir: () => 'fiel',
    });
    expect(candidato.razones).toContain('SIN_NORMA_ORTOGRAFICA_DECLARADA');
  });

  it('rechaza un texto fuente vacío', async () => {
    await expect(
      new GrafoTraduccionNativa().ejecutar({
        textoFuente: '   ',
        lengua: 'cora',
        embed,
        traducir: () => 'x',
      }),
    ).rejects.toThrow(/TEXTO_FUENTE_VACIO/);
  });

  it('usa el umbral por defecto documentado', () => {
    expect(new GrafoTraduccionNativa().guardia.umbralDeriva).toBe(UMBRAL_DERIVA_POR_DEFECTO);
  });
});

describe('Restricción de lengua del asistente', () => {
  // La restricción es prosa con saltos de línea duros: se compara sobre el
  // texto con espacios normalizados para que reacomodar un párrafo no rompa
  // una prueba que verifica lo que dice, no cómo está justificado.
  const dice = (fragmento: string) =>
    RESTRICCION_LENGUAS_ASISTENTE.replace(/\s+/g, ' ').includes(fragmento);

  it('prohíbe generar lengua originaria, no solo "preferir" el español', () => {
    expect(dice('Responde SIEMPRE en español')).toBe(true);
    expect(dice('Nunca generes texto en una lengua originaria')).toBe(true);
  });

  it('nombra las lenguas que el registro declara, no una lista escrita a mano', () => {
    for (const nombre of ['náayeri (cora)', 'wixárika']) {
      expect(dice(nombre)).toBe(true);
    }
  });

  it('desactiva el dato de interfaz como instrucción de idioma', () => {
    expect(dice('NO es una instrucción de idioma')).toBe(true);
  });

  it('ofrece atención humana en vez de improvisar la lengua', () => {
    expect(dice('atención humana')).toBe(true);
  });

  it('se adjunta a cualquier prompt del sistema, venga de donde venga', () => {
    // El .md público puede reemplazar el prompt entero; la regla no puede
    // borrarse editando ese archivo porque se compone en el servidor.
    const compuesto = componerPromptDelSistema('Eres ConnectX. Tono institucional.');
    expect(compuesto).toContain('Eres ConnectX. Tono institucional.');
    expect(compuesto).toContain(MARCA_RESTRICCION_LENGUAS);
  });

  it('no duplica la restricción si el prompt base ya la trae', () => {
    const unaVez = componerPromptDelSistema('base');
    const dosVeces = componerPromptDelSistema(unaVez);
    expect(dosVeces).toBe(unaVez);
    expect(dosVeces.split(MARCA_RESTRICCION_LENGUAS)).toHaveLength(2);
  });

  it('sigue restringiendo aunque el prompt base venga vacío', () => {
    expect(componerPromptDelSistema('   ')).toBe(RESTRICCION_LENGUAS_ASISTENTE);
  });
});

describe('interpolar', () => {
  it('deja visible el marcador faltante en vez de imprimir undefined', () => {
    expect(interpolar('Hola, {nombre}')).toBe('Hola, {nombre}');
  });
});
