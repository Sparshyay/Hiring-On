"use client";

import * as React from "react";
import { Check, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
// Assuming useDebounce hook exists, or I will implement simple one inside.
// Use internal debounce for search.

interface Option {
    value: string;
    label: string;
    description?: string; // Additional info like City, State
    [key: string]: any;
}

interface SearchableSelectProps {
    value?: string;
    onSelect: (value: string, item?: Option) => void;
    placeholder?: string;
    emptyMessage?: string;
    staticOptions?: Option[];
    searchFetcher?: (query: string) => Promise<Option[]>;
    disabled?: boolean;
    className?: string;
}

export function SearchableSelect({
    value,
    onSelect,
    placeholder = "Select...",
    emptyMessage = "No results found.",
    staticOptions,
    searchFetcher,
    disabled = false,
    className,
}: SearchableSelectProps) {
    const [open, setOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [options, setOptions] = React.useState<Option[]>(staticOptions || []);
    const [selectedLabel, setSelectedLabel] = React.useState<string>("");

    // Trigger search when updated
    React.useEffect(() => {
        if (!searchFetcher) {
            setOptions(
                staticOptions?.filter(opt =>
                    opt.label.toLowerCase().includes(searchTerm.toLowerCase())
                ) || []
            );
            return;
        }

        const timer = setTimeout(async () => {
            // Remove min length check to allow fetching initial list or on backspace
            setLoading(true);
            try {
                const results = await searchFetcher(searchTerm);
                setOptions(results);
            } catch (error) {
                console.error("Search failed", error);
                setOptions([]);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [searchTerm, searchFetcher, staticOptions]);

    // Update label when value changes (reverse lookup)
    React.useEffect(() => {
        if (value) {
            const found = options.find(o => o.value === value);
            if (found) setSelectedLabel(found.label);
            else if (!selectedLabel) setSelectedLabel(value);
        } else {
            setSelectedLabel("");
        }
    }, [value, options]);

    // .... (Previous code)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn("w-full justify-between", className)}
                    disabled={disabled}
                    onClick={() => {
                        // Optional: could manually trigger focus or search reset here
                    }}
                >
                    {selectedLabel || placeholder}
                    <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-100" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0 z-[9999]">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder={placeholder}
                        value={searchTerm}
                        onValueChange={setSearchTerm}
                    />
                    <CommandList className="max-h-[200px] overflow-y-auto">
                        {loading && (
                            <div className="flex items-center justify-center p-4">
                                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                            </div>
                        )}
                        {!loading && options.length === 0 && (
                            <CommandEmpty>{emptyMessage}</CommandEmpty>
                        )}
                        {!loading && options.map((option) => (
                            <CommandItem
                                key={option.value}
                                value={option.value}
                                onSelect={(currentValue) => {
                                    onSelect(option.value, option);
                                    setSelectedLabel(option.label);
                                    setOpen(false);
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === option.value ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                <div className="flex flex-col">
                                    <span>{option.label}</span>
                                    {option.description && (
                                        <span className="text-xs text-muted-foreground">{option.description}</span>
                                    )}
                                </div>
                            </CommandItem>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
