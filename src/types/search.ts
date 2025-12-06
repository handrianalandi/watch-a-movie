export enum SearchTypeEnum {
  MOVIE = "movie",
  SERIES = "series",
  EPISODE = "episode",
}
export interface SearchType {
  value: SearchTypeEnum;
  label: string;
}
