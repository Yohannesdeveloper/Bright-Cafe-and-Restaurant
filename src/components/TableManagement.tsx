'use client';

import { motion } from 'framer-motion';
import { GlassCard } from './GlassCard';
import { QRCodeSVG } from 'qrcode.react';
import { Plus, Edit, Trash2, Download, Copy, MapPin, Users, QrCode } from 'lucide-react';
import { useState } from 'react';

interface Table {
  id: number;
  number: string;
  capacity: number;
  location: string;
  qrCode: string;
  status: 'available' | 'occupied' | 'reserved';
}

interface TableManagementProps {
  tables: Table[];
  onAdd: (table: Omit<Table, 'id' | 'qrCode'>) => void;
  onEdit: (id: number, table: Partial<Table>) => void;
  onDelete: (id: number) => void;
}

export function TableManagement({ tables, onAdd, onEdit, onDelete }: TableManagementProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  const getMenuUrl = (tableNumber: string) =>
    `${window.location.origin}/menu/${tableNumber}`;

  const handleAdd = () => {
    setEditingTable(null);
    setIsModalOpen(true);
  };

  const handleEdit = (table: Table) => {
    setEditingTable(table);
    setIsModalOpen(true);
  };

  const handleGenerateQR = (table: Table) => {
    setSelectedTable({ ...table, qrCode: getMenuUrl(table.number) });
  };

  const handleDownloadQR = () => {
    if (selectedTable) {
      const svg = document.getElementById(`qr-${selectedTable.id}`);
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);
          const pngFile = canvas.toDataURL('image/png');
          const downloadLink = document.createElement('a');
          downloadLink.download = `table-${selectedTable.number}-qr.png`;
          downloadLink.href = pngFile;
          downloadLink.click();
        };
        
        img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
      }
    }
  };

  const getStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-500/20 text-green-500 border-green-500/30';
      case 'occupied':
        return 'bg-red-500/20 text-red-500 border-red-500/30';
      case 'reserved':
        return 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-500 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-black dark:text-white mb-1">
            Table Management
          </h2>
          <p className="text-black/60 dark:text-white/60">
            Manage restaurant tables and generate QR codes
          </p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleAdd}
          className="px-6 py-3 bg-[#D4AF37] text-white rounded-full font-medium hover:bg-[#B8962F] transition-colors flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Table</span>
        </motion.button>
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tables.map((table, index) => (
          <motion.div
            key={table.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <GlassCard className="overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-[#D4AF37]/20 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-[#D4AF37]" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-black dark:text-white">
                        Table {table.number}
                      </h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(table.status)}`}>
                        <span className="capitalize">{table.status}</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(table)}
                      className="p-2 bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-full"
                    >
                      <Edit className="w-4 h-4 text-[#D4AF37]" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => onDelete(table.id)}
                      className="p-2 bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-full"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </motion.button>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-2 text-sm">
                    <Users className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-black dark:text-white">
                      Capacity: {table.capacity} guests
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <MapPin className="w-4 h-4 text-[#D4AF37]" />
                    <span className="text-black dark:text-white">
                      {table.location}
                    </span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleGenerateQR(table)}
                  className="w-full px-4 py-3 bg-[#D4AF37]/20 text-[#D4AF37] border-2 border-[#D4AF37]/30 rounded-full font-medium hover:bg-[#D4AF37]/30 transition-all flex items-center justify-center space-x-2"
                >
                  <QrCode className="w-4 h-4" />
                  <span>Generate QR Code</span>
                </motion.button>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      {/* QR Code Modal */}
      {selectedTable && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <GlassCard className="w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-black dark:text-white">
                  QR Code - Table {selectedTable.number}
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedTable(null)}
                  className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-full"
                >
                  <Trash2 className="w-5 h-5 text-black dark:text-white" />
                </motion.button>
              </div>

              <div className="flex justify-center mb-6">
                <div className="p-4 bg-white rounded-xl">
                  <QRCodeSVG
                    id={`qr-${selectedTable.id}`}
                    value={selectedTable.qrCode}
                    size={200}
                    level="H"
                    includeMargin={true}
                    fgColor="#000000"
                    bgColor="#ffffff"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleDownloadQR}
                  className="w-full px-4 py-3 bg-[#D4AF37] text-white rounded-full font-medium hover:bg-[#B8962F] transition-colors flex items-center justify-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download QR Code</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    navigator.clipboard.writeText(selectedTable.qrCode);
                  }}
                  className="w-full px-4 py-3 border-2 border-[#D4AF37]/30 text-black dark:text-white rounded-full font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-center justify-center space-x-2"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Link</span>
                </motion.button>
              </div>

              <div className="mt-6 p-4 bg-[#D4AF37]/10 rounded-lg">
                <p className="text-sm text-black/70 dark:text-white/70 text-center">
                  Print this QR code and place it on Table {selectedTable.number} for customers to scan
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <GlassCard className="w-full max-w-md">
            <div className="p-6">
              <h3 className="text-2xl font-bold text-black dark:text-white mb-6">
                {editingTable ? 'Edit Table' : 'Add New Table'}
              </h3>
              
              <form className="space-y-6" onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const data = new FormData(form);
                const number = data.get('number') as string;
                const capacity = parseInt(data.get('capacity') as string) || 4;
                const location = data.get('location') as string;
                const status = data.get('status') as Table['status'];

                if (editingTable) {
                  onEdit(editingTable.id, { number, capacity, location, status });
                } else {
                  onAdd({ number, capacity, location, status });
                }
                setIsModalOpen(false);
              }}>
                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-2">
                    Table Number
                  </label>
                  <input
                    type="text"
                    name="number"
                    defaultValue={editingTable?.number}
                    className="w-full px-4 py-3 bg-white/60 dark:bg-black/60 backdrop-blur-xl border-2 border-[#D4AF37]/30 rounded-xl text-black dark:text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                    placeholder="e.g., A1, B2, etc."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-2">
                    Capacity (Guests)
                  </label>
                  <input
                    type="number"
                    name="capacity"
                    defaultValue={editingTable?.capacity}
                    className="w-full px-4 py-3 bg-white/60 dark:bg-black/60 backdrop-blur-xl border-2 border-[#D4AF37]/30 rounded-xl text-black dark:text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                    placeholder="e.g., 4"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    defaultValue={editingTable?.location}
                    className="w-full px-4 py-3 bg-white/60 dark:bg-black/60 backdrop-blur-xl border-2 border-[#D4AF37]/30 rounded-xl text-black dark:text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                    placeholder="e.g., Main Hall, Patio, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-black dark:text-white mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    defaultValue={editingTable?.status || 'available'}
                    className="w-full px-4 py-3 bg-white/60 dark:bg-black/60 backdrop-blur-xl border-2 border-[#D4AF37]/30 rounded-xl text-black dark:text-white focus:outline-none focus:border-[#D4AF37] transition-all"
                  >
                    <option value="available" className="bg-white dark:bg-black">Available</option>
                    <option value="occupied" className="bg-white dark:bg-black">Occupied</option>
                    <option value="reserved" className="bg-white dark:bg-black">Reserved</option>
                  </select>
                </div>

                <div className="flex space-x-4 pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 border-2 border-[#D4AF37]/30 text-black dark:text-white rounded-full font-medium hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="flex-1 px-6 py-3 bg-[#D4AF37] text-white rounded-full font-medium hover:bg-[#B8962F] transition-colors"
                  >
                    {editingTable ? 'Update Table' : 'Add Table'}
                  </motion.button>
                </div>
              </form>
            </div>
          </GlassCard>
        </div>
      )}
    </div>
  );
}