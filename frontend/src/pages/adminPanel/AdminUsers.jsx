import React, { useState, useEffect } from 'react';
import { Trash2, Search, Mail, User, ShieldCheck, ChevronRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import { getAdminUsers, deleteAdminUser } from '../../api';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res = await getAdminUsers();
            setUsers(res.data.data || res.data);
        } catch (err) {
            console.error('Failed to fetch users', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await deleteAdminUser(id);
            setUsers(users.filter(u => u._id !== id));
        } catch (err) {
            alert('Failed to delete user');
        }
    };

    const filteredUsers = users.filter(u => 
        u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col gap-1">
                    <h2 className="text-3xl font-black text-text-primary tracking-tight">User <span className="text-primary">Management</span></h2>
                    <p className="text-text-secondary text-xs font-black uppercase tracking-[0.3em] opacity-40">Manage all registered accounts</p>
                </div>
                <div className="flex items-center h-14 bg-white rounded-2xl px-5 w-full md:w-80 shadow-2xl shadow-primary/5 border border-gray-50 focus-within:ring-2 ring-primary/10 transition-all">
                    <Search className="size-4 text-text-secondary opacity-40" />
                    <input 
                        type="text" 
                        placeholder="Search name or email..."
                        className="bg-transparent border-none focus:ring-0 text-xs font-bold text-text-primary w-full px-4 placeholder:text-text-secondary placeholder:opacity-40"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <Card className="p-0 border-none shadow-2xl shadow-primary/5 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-surface/50 border-b border-gray-50">
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary opacity-40">User</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary opacity-40">Email</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary opacity-40">Role</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary opacity-40">Status</th>
                                <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-text-secondary opacity-40 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                [1,2,3].map(i => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="px-8 py-6 h-16 bg-surface/20"></td>
                                    </tr>
                                ))
                            ) : filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-surface/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-xs uppercase shadow-sm">
                                                {user.name?.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-black text-text-primary tracking-tight leading-none mb-1">{user.name}</span>
                                                <span className="text-[10px] font-black text-text-secondary opacity-40 uppercase tracking-tighter">ID: {user._id.slice(-8)}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="text-xs font-bold text-text-secondary">{user.email}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                            user.role === 'admin' ? 'bg-rose-50 text-rose-500' : 
                                            user.role === 'guide' ? 'bg-accent/10 text-accent' : 
                                            'bg-primary/10 text-primary'
                                        }`}>
                                            {user.role === 'admin' && <ShieldCheck size={10} />}
                                            {user.role}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-1.5 text-emerald-500 text-[9px] font-black uppercase tracking-widest">
                                            <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />
                                            Active
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <button 
                                            onClick={() => handleDelete(user._id)}
                                            className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all active:scale-90"
                                            title="Delete User"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!loading && filteredUsers.length === 0 && (
                        <div className="py-20 text-center opacity-30">
                            <User className="size-12 mx-auto mb-4 text-text-secondary" />
                            <p className="font-black text-[10px] uppercase tracking-widest">No users found match your search</p>
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default AdminUsers;
