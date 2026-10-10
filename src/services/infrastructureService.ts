import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  doc, 
  query, 
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

export type AssetType = 'ROAD' | 'BRIDGE' | 'SCHOOL' | 'HEALTH_CENTER' | 'WATER_INFRA' | 'ENERGY' | 'SECURITY';
export type AssetStatus = 'OPTIMAL' | 'RISK' | 'CRITICAL' | 'UNDER_MAINTENANCE' | 'PLANNED';

export interface InfrastructureAsset {
  id?: string;
  iun: string; // Identificador Único Nayarit (Ej: NAY-ROA-2026-001)
  name: string;
  type: AssetType;
  status: AssetStatus;
  departmentId: string; // Relación con la dependencia responsable
  location: {
    lat: number;
    lng: number;
    address: string;
    municipality: string;
  };
  metrics: {
    integrityScore: number; // 0-100 calculado por IA
    physicalCondition: number; // 0-100 reporte técnico
    socialImpact: number; // 0-100 basado en beneficiarios
    lastAuditDate: string;
    investmentAmount: number;
    beneficiaries: number;
  };
  description: string;
  responsible: string;
  path?: { lat: number; lng: number }[];
  tags: string[];
  metadata: {
    createdAt: string;
    updatedAt: string;
    version: number;
    source: 'MANUAL' | 'IOT' | 'CITIZEN_REPORT' | 'SATELLITE';
  };
}

const COLLECTION_NAME = 'infrastructure';

export const INITIAL_SEED_ASSETS: InfrastructureAsset[] = [
  {
    id: 'seed-1',
    iun: 'NAY-ROA-2026-001',
    name: 'Autopista Tepic-San Blas',
    type: 'ROAD',
    status: 'OPTIMAL',
    departmentId: 'sec-infra',
    location: { 
      lat: 21.52, 
      lng: -104.95, 
      address: 'Tramo Tepic-San Blas, Nayarit',
      municipality: 'San Blas'
    },
    path: [
      { lat: 21.5039, lng: -104.8947 },
      { lat: 21.51, lng: -104.92 },
      { lat: 21.52, lng: -104.95 }
    ],
    metrics: {
      integrityScore: 94,
      physicalCondition: 92,
      socialImpact: 88,
      lastAuditDate: '2026-03-15',
      investmentAmount: 450000000,
      beneficiaries: 120000
    },
    description: 'Arteria vital para el turismo y comercio costero.',
    responsible: 'Secretaría de Infraestructura',
    tags: ['TURISMO', 'LOGISTICA', 'ESTRATEGICO'],
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      source: 'MANUAL'
    }
  },
  {
    id: 'seed-2',
    iun: 'NAY-SCH-2026-001',
    name: 'Universidad Tecnológica de Nayarit',
    type: 'SCHOOL',
    status: 'OPTIMAL',
    departmentId: 'sec-edu',
    location: { 
      lat: 21.48, 
      lng: -104.85, 
      address: 'Ciudad del Conocimiento, Tepic',
      municipality: 'Tepic'
    },
    metrics: {
      integrityScore: 98,
      physicalCondition: 96,
      socialImpact: 95,
      lastAuditDate: '2026-02-20',
      investmentAmount: 120000000,
      beneficiaries: 5000
    },
    description: 'Centro de excelencia académica y tecnológica.',
    responsible: 'SEP Nayarit',
    tags: ['EDUCACION', 'TECNOLOGIA'],
    metadata: {
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1,
      source: 'MANUAL'
    }
  }
];

export const getMasterRegistry = async (): Promise<InfrastructureAsset[]> => {
  try {
    let querySnapshot;
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('iun', 'asc'));
      querySnapshot = await getDocs(q);
    } catch {
      // Fallback a consulta simple sin orderBy si no existe el índice
      querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
    }
    
    if (querySnapshot.empty) {
      return INITIAL_SEED_ASSETS;
    }

    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as InfrastructureAsset));
  } catch (error) {
    console.warn("Error fetching infrastructure registry, returning seed data:", error);
    return INITIAL_SEED_ASSETS;
  }
};

export const saveAsset = async (asset: Omit<InfrastructureAsset, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...asset,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, COLLECTION_NAME);
    throw error;
  }
};

export const updateAssetStatus = async (id: string, status: AssetStatus, integrityScore: number): Promise<void> => {
  try {
    const assetRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(assetRef, {
      status,
      'metrics.integrityScore': integrityScore,
      'metrics.lastAuditDate': new Date().toISOString().split('T')[0],
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${id}`);
    throw error;
  }
};

export const seedInfrastructure = async () => {
  try {
    const assets = await getMasterRegistry();
    if (assets.length > 0 && assets[0].id !== 'seed-1') return;

    const initialAssets: Omit<InfrastructureAsset, 'id'>[] = INITIAL_SEED_ASSETS.map(({ id, ...rest }) => rest);
    await Promise.all(initialAssets.map(asset => saveAsset(asset)));
  } catch (err) {
    console.warn('Skipping infrastructure seeding:', err);
  }
};
