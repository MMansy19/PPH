'use client';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { ModeSwitcher } from './ModeSwitcher';
import { ExportButtons } from './ExportButtons';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-64">
        <div className="space-y-4 mt-8">
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-gray-500 uppercase">View Mode</h3>
            <ModeSwitcher />
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold text-sm text-gray-500 uppercase">Export</h3>
            <ExportButtons />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
