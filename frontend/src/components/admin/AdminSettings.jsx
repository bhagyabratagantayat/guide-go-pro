import React, { useState, useEffect } from 'react';
import { getAdminConfig, updateAdminConfig } from '../../api';
import { IndianRupee, ShieldCheck, Save, RefreshCw, AlertCircle } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

const AdminSettings = () => {
    const [config, setConfig] = useState({ pricePerHour: 500 });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const res = await getAdminConfig();
            if (res.data.data) setConfig(res.data.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        try {
            await updateAdminConfig(config);
            setMessage('Configuration updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) { alert('Update failed'); }
        finally { setSaving(false); }
    };

    if (loading) return <div className="p-8 animate-pulse text-text-secondary font-bold">Loading configuration...</div>;

    return (
        <div className="space-y-8 animate-fade-in max-w-4xl">
            <div className="flex flex-col">
                <h2 className="text-3xl font-black text-text-primary tracking-tight">System <span className="text-primary">Settings</span></h2>
                <p className="text-sm font-bold text-text-secondary opacity-60 mt-2 uppercase tracking-widest">Platform Global Configuration</p>
            </div>

            <Card className="p-10 border-none shadow-2xl relative overflow-hidden" hover={false}>
                <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                    <Settings className="size-64 rotate-12" />
                </div>

                <form onSubmit={handleUpdate} className="relative z-10 space-y-10">
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="size-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                <IndianRupee className="size-6" />
                            </div>
                            <div>
                                <h4 className="font-black text-text-primary tracking-tight uppercase text-xs">Base Pricing Model</h4>
                                <p className="text-[10px] font-bold text-text-secondary opacity-60">Set the hourly rate charged to tourists globally.</p>
                            </div>
                        </div>

                        <div className="max-w-xs">
                             <Input 
                                type="number"
                                label="Price Per Hour (₹)"
                                value={config.pricePerHour}
                                onChange={(e) => setConfig({ ...config, pricePerHour: e.target.value })}
                                placeholder="e.g. 500"
                                required
                             />
                        </div>
                    </div>

                    <div className="p-6 bg-blue-50/50 border border-blue-100 rounded-[24px] flex gap-4">
                        <AlertCircle className="size-6 text-blue-500 shrink-0" />
                        <p className="text-[11px] font-bold text-blue-700 leading-relaxed uppercase tracking-wider">
                            Changes to the pricing model will apply immediately to all new booking requests. Existing ongoing trips will not be affected.
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button 
                            type="submit" 
                            className="h-14 px-10 bg-primary shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                            loading={saving}
                        >
                            <Save className="size-5 mr-3" /> Save Changes
                        </Button>
                        
                        {message && (
                            <span className="text-xs font-black text-emerald-500 uppercase tracking-widest animate-fade-in">
                                {message}
                            </span>
                        )}
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default AdminSettings;
