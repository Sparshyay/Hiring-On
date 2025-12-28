"use client";

import * as React from "react";
import { X, Check, ChevronsUpDown, Plus } from "lucide-react"; // Plus icon for 'add custom'
import { Badge } from "@/components/ui/badge";
import {
    Command,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandEmpty,
} from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk";

interface Option {
    value: string;
    label: string;
}

interface MultiSelectProps {
    selected: string[]; // Array of values (strings)
    onSelectedChange: (selected: string[]) => void;
    placeholder?: string;
    searchFetcher: (query: string) => Promise<Option[]>;
    maxCount?: number;
    allowCustom?: boolean;
}

export function MultiSelect({
    selected,
    onSelectedChange,
    placeholder = "Select items...",
    searchFetcher,
    maxCount = 10,
    allowCustom = false,
}: MultiSelectProps) {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [open, setOpen] = React.useState(false);
    const [inputValue, setInputValue] = React.useState("");
    const [options, setOptions] = React.useState<Option[]>([]);

    // Fetch suggestions
    React.useEffect(() => {
        const timer = setTimeout(async () => {
            if (inputValue.length > 0) {
                const res = await searchFetcher(inputValue);
                setOptions(res);
            } else {
                setOptions([]);
            }
        }, 300);
        return () => clearTimeout(timer);
    }, [inputValue, searchFetcher]);

    const handleUnselect = (item: string) => {
        onSelectedChange(selected.filter((i) => i !== item));
    };

    const handleSelect = (value: string) => {
        if (!selected.includes(value)) {
            onSelectedChange([...selected, value]);
            setInputValue("");
            setOptions([]);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        const input = inputRef.current;
        if (input) {
            if (e.key === "Delete" || e.key === "Backspace") {
                if (input.value === "" && selected.length > 0) {
                    handleUnselect(selected[selected.length - 1]);
                }
            }
            if (e.key === "Enter" && allowCustom && inputValue.length > 0 && options.length === 0) {
                // Add custom tag
                handleSelect(inputValue);
            }
        }
    };

    return (
        <Command onKeyDown={handleKeyDown} className="overflow-visible bg-transparent">
            <div
                className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2"
            >
                <div className="flex gap-1 flex-wrap">
                    {selected.map((item) => (
                        <Badge key={item} variant="secondary">
                            {item}
                            <button
                                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleUnselect(item);
                                    }
                                }}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                                onClick={() => handleUnselect(item)}
                            >
                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                            </button>
                        </Badge>
                    ))}
                    <CommandPrimitive.Input
                        ref={inputRef}
                        value={inputValue}
                        onValueChange={setInputValue}
                        onBlur={() => setOpen(false)}
                        onFocus={() => setOpen(true)}
                        placeholder={placeholder}
                        className="ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1"
                    />
                </div>
            </div>
            <div className="relative mt-2">
                {open && (options.length > 0 || (allowCustom && inputValue.length > 0)) && (
                    <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in fade-in-0 zoom-in-95">
                        <CommandList>
                            {options.map((option) => (
                                <CommandItem
                                    key={option.value}
                                    onSelect={() => handleSelect(option.value)}
                                    className="cursor-pointer"
                                >
                                    {option.label}
                                </CommandItem>
                            ))}
                            {allowCustom && inputValue.length > 0 && !options.find(o => o.value.toLowerCase() === inputValue.toLowerCase()) && (
                                <CommandItem onSelect={() => handleSelect(inputValue)} className="cursor-pointer">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add "{inputValue}"
                                </CommandItem>
                            )}
                        </CommandList>
                    </div>
                )}
            </div>
        </Command>
    );
}
