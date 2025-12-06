interface SectionHeaderProps {
    title: string;
    description?: string;
    action?: React.ReactNode;
}

export function SectionHeader({ title, description, action }: SectionHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{title}</h2>
                {description && (
                    <p className="text-muted-foreground mt-2 text-lg">{description}</p>
                )}
            </div>
            {action && <div>{action}</div>}
        </div>
    );
}
