export class ItemsServiceError extends Error {
	constructor(error: string, details: string) {
		super(error);

		this.name = error;
		this.message = details;
	}
}
