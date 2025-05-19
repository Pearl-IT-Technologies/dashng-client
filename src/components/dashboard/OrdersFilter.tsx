import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CalendarX2, FilterX, RefreshCw } from 'lucide-react';

export interface OrdersFilterProps {
  onFilterChange: (filters: {
    orderType: 'all' | 'online' | 'in-store';
    fromDate?: Date;
    toDate?: Date;
    status?: string;
  }) => void;
  showStatusFilter?: boolean;
  admins?: Array<{ id: number; name: string }>;
}

const OrdersFilter: React.FC<OrdersFilterProps> = ({ 
  onFilterChange, 
  showStatusFilter = true 
}) => {
  const [orderType, setOrderType] = useState<'all' | 'online' | 'in-store'>('all');
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [status, setStatus] = useState<string>('all');

  // Apply filters
  const applyFilters = () => {
    onFilterChange({
      orderType,
      fromDate,
      toDate,
      status: status === 'all' ? undefined : status
    });
  };

  // Reset filters
  const resetFilters = () => {
    setOrderType('all');
    setFromDate(undefined);
    setToDate(undefined);
    setStatus('all');
    
    onFilterChange({
      orderType: 'all',
      fromDate: undefined,
      toDate: undefined,
      status: undefined
    });
  };

  // Clear date filters
  const clearDateFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
    
    onFilterChange({
      orderType,
      fromDate: undefined,
      toDate: undefined,
      status: status === 'all' ? undefined : status
    });
  };

  return (
    <div className="bg-card p-4 rounded-lg shadow-sm space-y-4 mb-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Filter Orders</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={resetFilters}
          className="text-muted-foreground hover:text-foreground"
        >
          <FilterX className="h-4 w-4 mr-2" />
          Reset Filters
        </Button>
      </div>
      
      <Separator />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Order Type Filter */}
        <div className="space-y-2">
          <Label htmlFor="order-type">Order Type</Label>
          <Select 
            value={orderType} 
            onValueChange={(value: 'all' | 'online' | 'in-store') => setOrderType(value)}
          >
            <SelectTrigger id="order-type">
              <SelectValue placeholder="Select order type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="online">Online Orders</SelectItem>
              <SelectItem value="in-store">In-Store Orders</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Date Range - From */}
        <div className="space-y-2">
          <Label htmlFor="from-date">From Date</Label>
          <DatePicker
            date={fromDate}
            setDate={(date: Date | undefined) => setFromDate(date)}
            placeholder="Select start date"
            className="w-full"
          />
        </div>
        
        {/* Date Range - To */}
        <div className="space-y-2">
          <Label htmlFor="to-date">To Date</Label>
          <DatePicker
            date={toDate}
            setDate={(date: Date | undefined) => setToDate(date)}
            placeholder="Select end date" 
            className="w-full"
          />
        </div>
        
        {/* Order Status (Conditional) */}
        {showStatusFilter && (
          <div className="space-y-2">
            <Label htmlFor="status">Order Status</Label>
            <Select 
              value={status} 
              onValueChange={(value) => setStatus(value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button
          variant="outline"
          onClick={clearDateFilters}
          size="sm"
        >
          <CalendarX2 className="h-4 w-4 mr-2" />
          Clear Dates
        </Button>
        <Button
          onClick={applyFilters}
          size="sm"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Apply Filters
        </Button>
      </div>
    </div>
  );
};

export default OrdersFilter;