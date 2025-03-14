"use client"

import * as React from "react"
import { Check, ChevronsUpDown, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export function Combobox({ 
  options = [], 
  onSelect, 
  onCreateOption, 
  placeholder = "Select an option...", 
  className,
  searchBy = "label", // New prop to control search behavior, defaults to "label"
  id,
}) {
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")
    const [inputValue, setInputValue] = React.useState("")

    const handleSelect = (currentValue) => {
        // If selecting the same value, clear it
        if (currentValue === value) {
            setValue("")
            setInputValue("")
        } else {
            setValue(currentValue)
            const selectedOption = options.find((option) => option.value === currentValue)
            setInputValue(selectedOption ? selectedOption.label : "")
        }
        setOpen(false)
        onSelect?.(currentValue)
    }

    const handleCreateOption = async () => {
        if (!inputValue.trim()) return

        try {
            const newOption = await onCreateOption?.(inputValue.trim())
            if (newOption) {
                setValue(newOption.id)
                setInputValue(newOption.name)
            }
            setOpen(false)
        } catch (error) {
            console.error("Error creating option:", error)
        }
    }

    // Filter options based on inputValue and searchBy prop
    const filteredOptions = React.useMemo(() => {
        if (!inputValue) return options
        
        const search = inputValue.toLowerCase()
        return options.filter(option => {
            if (searchBy === "value") {
                return String(option.value).toLowerCase().includes(search)
            } else {
                return option.label.toLowerCase().includes(search)
            }
        })
    }, [options, inputValue, searchBy])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" id={id} aria-expanded={open} className={cn("justify-between", className)}>
                    {inputValue || placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0">
                <Command>
                    <CommandInput 
                      placeholder={`Search by ${searchBy === 'label' ? 'name' : 'ID'}...`} 
                      value={inputValue} 
                      onValueChange={setInputValue} 
                    />
                    <CommandList>
                        <CommandEmpty>
                            <div className="flex flex-col items-center justify-center p-4">
                                <p className="text-sm text-muted-foreground mb-2">No company found</p>
                                <Button variant="outline" size="sm" onClick={handleCreateOption} className="flex items-center">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add "{inputValue}"
                                </Button>
                            </div>
                        </CommandEmpty>
                        <CommandGroup>
                            {filteredOptions.map((option) => (
                                <CommandItem 
                                  key={option.value} 
                                  value={searchBy === "label" ? option.label : String(option.value)} 
                                  onSelect={() => handleSelect(option.value)}
                                >
                                    <Check className={cn("mr-2 h-4 w-4", value === option.value ? "opacity-100" : "opacity-0")} />
                                    {option.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}