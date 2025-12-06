import { SearchType, SearchTypeEnum } from "@/types/search";

export const SEARCH_TYPE: SearchType[] = [
  {
    value: SearchTypeEnum.MOVIE,
    label: "Movie",
  },
  {
    value: SearchTypeEnum.SERIES,
    label: "Series",
  },
  {
    value: SearchTypeEnum.EPISODE,
    label: "Episode",
  },
];
