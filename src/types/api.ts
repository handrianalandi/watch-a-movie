import { SearchTypeEnum } from "./search";

export interface SearchQuery {
  search: string;
  type: SearchTypeEnum;
}
