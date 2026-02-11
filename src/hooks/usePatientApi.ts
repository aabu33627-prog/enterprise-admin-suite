import { useState, useCallback } from 'react';
import {
  PatientListDTO,
  PatientListByIdDTO,
  PatientCreateDTO,
  PatientUpdateDTO,
  PatientDeleteDTO,
  DropdownOption,
} from '@/types/patient';

const API_BASE_URL = 'http://103.14.123.247:8080/api';
const ADMIN_API_URL = 'http://103.14.123.247:8080/api/admin';

export const usePatientApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // GET /api/patient?hospitalId=1
  const fetchPatients = useCallback(async (hospitalId: number = 1): Promise<PatientListDTO[]> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/patient?hospitalId=${hospitalId}`);
      if (!response.ok) throw new Error('Failed to fetch patients');
      return await response.json();
    } catch (err) {
      console.warn('API not available, returning empty list');
      setError('Unable to fetch patients');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // GET /api/patient/{id}?hospitalId=1
  const fetchPatientById = useCallback(async (id: number, hospitalId: number = 1): Promise<PatientListByIdDTO | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/patient/${id}?hospitalId=${hospitalId}`);
      if (!response.ok) throw new Error('Failed to fetch patient');
      return await response.json();
    } catch (err) {
      console.warn('API not available');
      setError('Unable to fetch patient');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // POST /api/patient
  const createPatient = useCallback(async (patient: PatientCreateDTO): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/patient`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patient),
      });
      if (!response.ok) throw new Error('Failed to create patient');
      return await response.json();
    } catch (err) {
      console.error('Failed to create patient:', err);
      throw new Error('Failed to create patient');
    } finally {
      setLoading(false);
    }
  }, []);

  // PUT /api/patient (no ID in URL, full object in body)
  const updatePatient = useCallback(async (patient: PatientUpdateDTO): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/patient`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patient),
      });
      if (!response.ok) throw new Error('Failed to update patient');
      return await response.json();
    } catch (err) {
      console.error('Failed to update patient:', err);
      throw new Error('Failed to update patient');
    } finally {
      setLoading(false);
    }
  }, []);

  // DELETE /api/patient (body payload, no ID in URL)
  const deletePatient = useCallback(async (payload: PatientDeleteDTO): Promise<any> => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/patient`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error('Failed to delete patient');
      return await response.json();
    } catch (err) {
      console.error('Failed to delete patient:', err);
      throw new Error('Failed to delete patient');
    } finally {
      setLoading(false);
    }
  }, []);

  // Dropdown data fetchers - calls admin API endpoints (NOT MODIFIED)
  const fetchDropdownData = useCallback(async (type: string): Promise<DropdownOption[]> => {
  try {
    const response = await fetch(`${ADMIN_API_URL}/${type}`);
    if (!response.ok) throw new Error(`Failed to fetch ${type}`);

    const data = await response.json();

    switch (type.toLowerCase()) {

      case 'title':
        return data.map((t: any) => ({
          id: t.title_Id,
          name: t.title_Name
        }));

      case 'patientcategory':
        return data.map((p: any) => ({
          id: p.patientCategory_ID,
          name: p.patientCategory_Name
        }));

      case 'bloodgroup':
        return data.map((b: any) => ({
          id: b.id,
          name: b.bloodGroup
        }));

      case 'consultant':
        return data.map((c: any) => ({
          id: c.consultant_id,
          name: c.first_name
        }));

      case 'referredby':
        return data
          .filter((r: any) => r.referred_By_Name && r.referred_By_Name.trim() !== '')
          .map((r: any) => ({
            id: r.patientReferral_Id,
            name: r.referred_By_Name
          }));

      case 'area':
        return data.map((a: any) => ({
          id: a.area_id,
          name: a.name
        }));

      case 'city':
        return data.map((c: any) => ({
          id: c.city_id,
          name: c.name
        }));

      case 'state':
        return data.map((s: any) => ({
          id: s.state_id,
          name: s.name
        }));

      case 'relation':
        return data.map((r: any) => ({
          id: r.relation_ID,
          name: r.relation_Name
        }));

      case 'country':
        return data.map((c: any) => ({
          id: c.country_id,
          name: c.name
        }));

      case 'organization':
        return data.map((o: any) => ({
          id: o.organization_id,
          name: o.organization_name
        }));

      default:
        console.warn(`No mapping defined for dropdown type: ${type}`);
        return [];
    }

  } catch (err) {
    console.warn(`API not available for ${type}`);
    return [];
  }
}, []);


  const fetchTitles = useCallback(() => fetchDropdownData('title'), [fetchDropdownData]);
  const fetchBloodGroups = useCallback(() => fetchDropdownData('bloodgroup'), [fetchDropdownData]);
  const fetchAreas = useCallback(() => fetchDropdownData('area'), [fetchDropdownData]);
  const fetchCities = useCallback(() => fetchDropdownData('city'), [fetchDropdownData]);
  const fetchStates = useCallback(() => fetchDropdownData('state'), [fetchDropdownData]);
  const fetchRelations = useCallback(() => fetchDropdownData('relation'), [fetchDropdownData]);
  const fetchConsultants = useCallback(() => fetchDropdownData('consultant'), [fetchDropdownData]);
  const fetchReferredBy = useCallback(() => fetchDropdownData('referredby'), [fetchDropdownData]);
  const fetchCountries = useCallback(() => fetchDropdownData('country'), [fetchDropdownData]);
  const fetchOrganizations = useCallback(() => fetchDropdownData('organization'), [fetchDropdownData]);
  const fetchPatientCategories = useCallback(() => fetchDropdownData('patientcategory'), [fetchDropdownData]);

  return {
    loading,
    error,
    fetchPatients,
    fetchPatientById,
    createPatient,
    updatePatient,
    deletePatient,
    fetchDropdownData,
    fetchTitles,
    fetchBloodGroups,
    fetchAreas,
    fetchCities,
    fetchOrganizations,
    fetchCountries,
    fetchStates,
    fetchRelations,
    fetchConsultants,
    fetchReferredBy,
    fetchPatientCategories,
  };
};
