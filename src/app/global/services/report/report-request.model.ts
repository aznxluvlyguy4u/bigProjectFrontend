abstract class Worker {
	public id: number;
	started_at: string;
	finished_at: string;
	worker_type: number;
	public error_code: number;
	public error_message: string;
}

export class ReportRequest extends Worker {
	download_url: string;
	hash: string;
	report_type: ReportType;
	file_type: string;
}

export enum ReportType {
  ANNUAL_ACTIVE_LIVE_STOCK = 1,
  ANNUAL_TE_100 = 2,
  FERTILIZER_ACCOUNTING = 3,
  INBREEDING_COEFFICIENT = 4,
  PEDIGREE_CERTIFICATE = 5,
  ANIMALS_OVERVIEW = 6,
  ANNUAL_ACTIVE_LIVE_STOCK_RAM_MATES = 7,
  OFF_SPRING = 8,
  PEDIGREE_REGISTER_OVERVIEW = 9,
  LIVE_STOCK = 10,
  BIRTH_LIST = 11,
  MEMBERS_AND_USERS_OVERVIEW = 12,
  ANIMAL_HEALTH_STATUS_REPORT = 13,
  ANIMAL_FEATURES_PER_YEAR_OF_BIRTH_REPORT = 16,
  CLIENT_NOTES_OVERVIEW = 17,
  WEIGHTS_PER_YEAR_OF_BIRTH_REPORT = 25,
  POPREP_INPUT_FILE = 23
}
