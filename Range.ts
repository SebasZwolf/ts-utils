type map<T, E = T> = (t : T) => E;

class Serie implements Iterable<number> {
	private ini : number;
	private end : number;
	constructor(a : number, b? : number,
		private stp : number = 1,
	) {
		this.end = b ?? a;
		this.ini = typeof b !== 'undefined' ? a : 0;
	}

	map<O>(cb : map<number, O>) : Mapped<number, O> {
		return new Mapped(this, [cb]);
	}

	* [Symbol.iterator]() {
		let count = this.ini;

		const check = this.stp !== 0 ? this.stp > 0 ? () => count < this.end : () => count > this.end : () => false;

		while(check()) {
			yield count;
			count += this.stp;
		}
	}

	slice(i : number, e : number, s : number = 1) : Serie {
		const temp_ini = (i < 0 ? this.end : this.ini) + i * this.stp;
		const temp_end = e < 0 ? Math.max(this.ini, this.end + e * this.stp) : Math.min(this.end, temp_ini + e * this.stp);

		return new Serie(
			temp_ini,
			temp_end + temp_end % this.stp,
			this.stp * s,
		)
	}

  toString() : string { return `range(${this.ini}:${this.end}:${this.stp})`; }
}

class Mapped<I = number, O = number> implements Iterable<O> {
	constructor(
		public readonly serie : Serie,
		private fns : Array<map<I,O>> = []
	) {}

  toString() : string { return `map(${this.fns.join(')(')})(${this.serie})`.replaceAll(' ',''); }

	map<T>(cb : map<O,T>) : Mapped<O,T> { 
		return new Mapped<O,T>(this.serie, this.fns.concat(cb as any) as any);
	}

	* [Symbol.iterator]() { 
		for (const v of this.serie)
			yield this.fns.reduce((p,c) => c(p as any) as any, v) as O;
	}
}


// new Serie(0,10).map(e => `${e}`).map(e => Number(e));

export { Serie, Mapped };