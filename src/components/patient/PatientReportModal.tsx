import { useState, useEffect } from 'react';
import { PatientListDTO } from '@/types/patient';
import { usePatientApi } from '@/hooks/usePatientApi';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

type ReportType = 'IPBill' | 'LabReport';

interface IPBillFields {
  admission_no: string;
  patient_uhid: string;
  hospital_id: number;
  appuserid: number;
}

interface LabReportFields {
  billNo: string;
  hospitalID: number;
  testIds: string;
  profileSingleId: string;
  profileMultipId: string;
  profileDropdownId: string;
  opip_ind: string;
  lab_no: string;
}

interface PatientReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patient: PatientListDTO | null;
}

const defaultIPBill = (patientUhid: string): IPBillFields => ({
  admission_no: '',
  patient_uhid: patientUhid,
  hospital_id: 1,
  appuserid: 1,
});

const defaultLabReport: LabReportFields = {
  billNo: '',
  hospitalID: 1,
  testIds: '',
  profileSingleId: '',
  profileMultipId: '',
  profileDropdownId: '',
  opip_ind: '',
  lab_no: '',
};

export const PatientReportModal = ({ open, onOpenChange, patient }: PatientReportModalProps) => {
  const { fetchPatientReport, loading } = usePatientApi();
  const { toast } = useToast();
  const [reportType, setReportType] = useState<ReportType>('IPBill');
  const [ipFields, setIpFields] = useState<IPBillFields>(defaultIPBill(''));
  const [labFields, setLabFields] = useState<LabReportFields>(defaultLabReport);

  useEffect(() => {
    if (open && patient) {
      setReportType('IPBill');
      setIpFields(defaultIPBill(patient.code || ''));
      setLabFields({ ...defaultLabReport });
    }
  }, [open, patient]);

  const handleSubmit = async () => {
    if (reportType === 'IPBill') {
      if (!ipFields.admission_no.trim() || !ipFields.patient_uhid.trim()) {
        toast({ title: 'Validation', description: 'Admission No and Patient UHID are required', variant: 'destructive' });
        return;
      }
      try {
        await fetchPatientReport({
          outputType: 'PDF',
          reportType: 'IPBill',
          parameters: { ...ipFields },
        });
        onOpenChange(false);
      } catch {
        toast({ title: 'Error', description: 'Failed to generate IP Bill report', variant: 'destructive' });
      }
    } else {
      if (!labFields.billNo.trim() || !labFields.testIds.trim() || !labFields.opip_ind.trim() || !labFields.lab_no.trim()) {
        toast({ title: 'Validation', description: 'Bill No, Test IDs, OP/IP Ind, and Lab No are required', variant: 'destructive' });
        return;
      }
      try {
        await fetchPatientReport({
          outputType: 'PDF',
          reportType: 'LabReport',
          parameters: { ...labFields },
        });
        onOpenChange(false);
      } catch {
        toast({ title: 'Error', description: 'Failed to generate Lab Report', variant: 'destructive' });
      }
    }
  };

  const updateIp = (field: keyof IPBillFields, value: string | number) =>
    setIpFields(prev => ({ ...prev, [field]: value }));

  const updateLab = (field: keyof LabReportFields, value: string | number) =>
    setLabFields(prev => ({ ...prev, [field]: value }));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Generate Report</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Report Type</Label>
            <Select value={reportType} onValueChange={(v) => setReportType(v as ReportType)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="IPBill">IP Bill</SelectItem>
                <SelectItem value="LabReport">Lab Report</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {reportType === 'IPBill' ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Admission No *</Label>
                <Input value={ipFields.admission_no} onChange={e => updateIp('admission_no', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Patient UHID *</Label>
                <Input value={ipFields.patient_uhid} onChange={e => updateIp('patient_uhid', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Hospital ID</Label>
                <Input type="number" value={ipFields.hospital_id} onChange={e => updateIp('hospital_id', Number(e.target.value))} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">App User ID</Label>
                <Input type="number" value={ipFields.appuserid} onChange={e => updateIp('appuserid', Number(e.target.value))} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Bill No *</Label>
                <Input value={labFields.billNo} onChange={e => updateLab('billNo', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Hospital ID *</Label>
                <Input type="number" value={labFields.hospitalID} onChange={e => updateLab('hospitalID', Number(e.target.value))} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Test IDs * (comma separated)</Label>
                <Input value={labFields.testIds} onChange={e => updateLab('testIds', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Profile Single ID</Label>
                <Input value={labFields.profileSingleId} onChange={e => updateLab('profileSingleId', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Profile Multip ID</Label>
                <Input value={labFields.profileMultipId} onChange={e => updateLab('profileMultipId', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Profile Dropdown ID</Label>
                <Input value={labFields.profileDropdownId} onChange={e => updateLab('profileDropdownId', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">OP/IP Ind *</Label>
                <Input value={labFields.opip_ind} onChange={e => updateLab('opip_ind', e.target.value)} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Lab No *</Label>
                <Input value={labFields.lab_no} onChange={e => updateLab('lab_no', e.target.value)} />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            Generate Report
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
