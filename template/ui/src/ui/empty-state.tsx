export function EmptyState({
	children,
	icon,
}: {
	children?: React.ReactNode;
	icon?: React.ReactNode;
}) {
	return (
		<div className="p-6 flex flex-col justify-center items-center gap-4">
			{icon && (
				<div className="flex-none *:size-[50%] size-[114px] bg-card rounded-full flex items-center justify-center">
					{icon}
				</div>
			)}
			<div className="text-muted-foreground flex-none">{children}</div>
			<div className="flex-1"></div>
		</div>
	);
}
