import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getMasterRegistry,
  saveAsset,
  updateAssetStatus,
  seedInfrastructure,
  INITIAL_SEED_ASSETS,
  InfrastructureAsset
} from '../infrastructureService';

// Mock Firestore functions
vi.mock('firebase/firestore', () => {
  return {
    collection: vi.fn(),
    getDocs: vi.fn(),
    addDoc: vi.fn(),
    updateDoc: vi.fn(),
    doc: vi.fn(),
    query: vi.fn(),
    orderBy: vi.fn(),
    Timestamp: {
      now: vi.fn(() => ({ toMillis: () => 1234567890 }))
    },
    getDocFromServer: vi.fn()
  };
});

// Mock the local firebase module
vi.mock('../../firebase', () => ({
  db: {},
  OperationType: { WRITE: 'write', UPDATE: 'update' },
  handleFirestoreError: vi.fn()
}));

import { getDocs, addDoc, updateDoc } from 'firebase/firestore';
import { handleFirestoreError } from '../../firebase';

describe('infrastructureService', () => {
  const mockAsset: Omit<InfrastructureAsset, 'id'> = {
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
      createdAt: '2026-01-01',
      updatedAt: '2026-01-01',
      version: 1,
      source: 'MANUAL'
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getMasterRegistry', () => {
    it('should return seed assets if querySnapshot is empty', async () => {
      (getDocs as any).mockResolvedValueOnce({
        empty: true,
        docs: []
      });

      const result = await getMasterRegistry();
      expect(result).toEqual(INITIAL_SEED_ASSETS);
    });

    it('should return mapped assets if querySnapshot has data', async () => {
      const mockDoc = {
        id: 'test-id-123',
        data: () => mockAsset
      };

      (getDocs as any).mockResolvedValueOnce({
        empty: false,
        docs: [mockDoc]
      });

      const result = await getMasterRegistry();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual({
        id: 'test-id-123',
        ...mockAsset
      });
    });

    it('should return seed assets on error and log it', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      (getDocs as any).mockRejectedValueOnce(new Error('Firebase error'));

      const result = await getMasterRegistry();

      expect(result).toEqual(INITIAL_SEED_ASSETS);
      expect(consoleWarnSpy).toHaveBeenCalledWith("Error fetching infrastructure registry, returning seed data:", expect.any(Error));
      consoleWarnSpy.mockRestore();

    });
  });

  describe('saveAsset', () => {
    it('should save asset and return document ID', async () => {
      const mockDocRef = { id: 'new-doc-id' };
      (addDoc as any).mockResolvedValueOnce(mockDocRef);

      const result = await saveAsset(mockAsset);

      expect(addDoc).toHaveBeenCalled();
      expect(result).toBe('new-doc-id');
    });

    it('should throw error if addDoc fails', async () => {
      const mockError = new Error('Save failed');
      (addDoc as any).mockRejectedValueOnce(mockError);

      await expect(saveAsset(mockAsset)).rejects.toThrow('Save failed');
      expect(handleFirestoreError).toHaveBeenCalledWith(mockError, 'write', 'infrastructure');

    });
  });

  describe('updateAssetStatus', () => {
    it('should update asset status successfully', async () => {
      (updateDoc as any).mockResolvedValueOnce(undefined);

      await updateAssetStatus('test-id-123', 'CRITICAL', 55);

      expect(updateDoc).toHaveBeenCalled();
      const updateCall = (updateDoc as any).mock.calls[0];
      expect(updateCall[1]).toEqual(expect.objectContaining({
        status: 'CRITICAL',
        'metrics.integrityScore': 55
      }));
    });

    it('should throw error if updateDoc fails', async () => {
      const mockError = new Error('Update failed');
      (updateDoc as any).mockRejectedValueOnce(mockError);

      await expect(updateAssetStatus('test-id-123', 'CRITICAL', 55)).rejects.toThrow('Update failed');
      expect(handleFirestoreError).toHaveBeenCalledWith(mockError, 'update', 'infrastructure/test-id-123');

    });
  });

  describe('seedInfrastructure', () => {
    it('should not seed if assets already exist', async () => {
      (getDocs as any).mockResolvedValueOnce({
        empty: false,
        docs: [{ id: 'test', data: () => mockAsset }]
      });

      await seedInfrastructure();

      expect(addDoc).not.toHaveBeenCalled();
    });

    it('should seed multiple assets if registry is empty', async () => {
      (getDocs as any).mockResolvedValueOnce({
        empty: true,
        docs: []
      });
      (addDoc as any).mockResolvedValue({ id: 'seeded-id' });

      await seedInfrastructure();

      // There are 2 assets seeded in the actual implementation
      expect(addDoc).toHaveBeenCalledTimes(2);
    });
  });
});
