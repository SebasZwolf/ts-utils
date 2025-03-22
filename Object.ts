function pick<T extends Record<PropertyKey, unknown>, E extends keyof T>(o : T, e : E[]) {
	const d : Pick<T, E> = {} as any;
	for(const k of e)
    d[k] = o[k];
	return d;
	// return e.reduce<Pick<T, E>>((p,c) => (c in o && (p[c] = o[c]), p), {} as any);
}

function omit<T extends Record<PropertyKey, unknown>, E extends keyof T>(o : T, e : E[]) {
	const d : Omit<T, E> = { ...o } as any;
	
	for(const k of e) 
		if (k in d)
			delete (d as any)[k];

	return d;
}

export { pick, omit };
