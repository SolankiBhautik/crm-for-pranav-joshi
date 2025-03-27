"use client"

import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { Combobox } from "@/components/combobox"

interface AddCompanyFormProps {
    allCompanies: any[]
    handleCompanySelect: (value: string) => void
    handleAddCompany: (value: string) => void
    onCancel: () => void
}

export function AddCompanyForm({ allCompanies, handleCompanySelect, handleAddCompany, onCancel }: AddCompanyFormProps) {
    return (
        <div className="flex gap-2 items-center">
            <Combobox
                id="companySelect"
                options={allCompanies.map((c) => ({ label: c.name, value: c.id }))}
                onSelect={handleCompanySelect}
                onCreateOption={handleAddCompany}
                placeholder="Search or add company..."
                className="w-64"
            />
            <Button variant="ghost" size="sm" onClick={onCancel}>
                <X className="h-4 w-4" />
            </Button>
        </div>
    )
}

