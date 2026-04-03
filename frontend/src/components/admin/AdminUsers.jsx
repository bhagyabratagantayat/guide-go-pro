import React, { useState, useEffect } from 'react';
import { getAdminUsers, deleteAdminUser } from '../../api';
import { Trash2, User, Mail, Calendar, Shield } from 'lucide-react';
import Card from '../ui/Card';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await getAdminUsers();
            setUsers(res.data.data);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await deleteAdminUser(id);
            setUsers(users.filter(u => u._id !== id));
        } catch (err) { alert('Failed to delete user'); }
    };

    if (loading) return <div className="p-8 animate-pulse text-text-secondary font-bold">Loading users...</div>;

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex flex-col">
                <h2 className="text-3xl font-black text-text-primary tracking-tight">User <span className="text-primary">Management</span></h2>
                <p className="text-sm font-bold text-text-secondary opacity-60 mt-2 uppercase tracking-widest">Total Active Tourists: {users.length}</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
                {users.map((u) => (
                    <Card key={u._id} className="p-6 border-none shadow-sm hover:shadow-xl transition-all group" hover={false}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                                <div className="size-14 bg-gray-50 rounded-2xl flex items-center justify-center text-text-secondary border border-gray-100 group-hover:bg-primary group-hover:text-white transition-colors">
                                    <User className="size-7" />
                                </div>
                                <div className="flex flex-col">
                                    <h3 className="font-black text-text-primary text-xl tracking-tight">{u.name}</h3>
                                    <div className="flex items-center gap-4 mt-1 text-sm font-bold text-text-secondary opacity-60">
                                        <div className="flex items-center gap-1.5"><Mail className="size-3" /> {u.email}</div>
                                        <div className="flex items-center gap-1.5"><Calendar className="size-3" /> Joined {new Date(u.createdAt).toLocaleDateString()}</div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest border border-emerald-100 italic">
                                    Tourist
                                </div>
                                <button 
                                    onClick={() => handleDelete(u._id)}
                                    className="size-11 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                                >
                                    <Trash2 className="size-5" />
                                </button>
                            </div>
                        </div>
                    </Card>
                ))}
                {users.length === 0 && (
                    <div className="text-center py-24 bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200">
                        <Users className="size-16 text-gray-300 mx-auto mb-4" />
                        <p className="font-black text-gray-400 uppercase tracking-widest">No users found</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminUsers;
