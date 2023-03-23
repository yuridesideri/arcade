
export function parseControlLogaritm(delta: number, base: number, limit: number): number {
	if (base < 0 || base >= 1) throw new Error("Invalid base");
	// if (delta <= 1) throw new Error("Invalid number");
	let log = Math.log(delta * base) / Math.log(base);
	log = log * base;
	if (log <= 0.00001) return 0;
	else if (log >= limit) return limit;
	else return log;
}
