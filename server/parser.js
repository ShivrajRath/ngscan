import cheerio from "cheerio";
import axios from "axios";
import constants from "./constants";
import { SummaryParser } from "./summaryParser";

export class Parser {
  constructor(ingredient) {
    this.ingredient = ingredient.replace(/\s+/gi, "+");
  }

  async fetchData(url) {
    const result = await axios.get(url);
    return cheerio.load(result.data);
  }

  async setIngredientURL() {
    const $ = await this.fetchData(
      `${constants.urls.search}${this.ingredient}`
    );

    const $AllMatch = $("#table-browse tbody tr");
    let $firstMatch;
    let $ingredientURL;

    if ($AllMatch.length > 1) {
      $firstMatch = $($AllMatch[1]);
      // if it is ingredient
      if ($firstMatch.text().match(/ingredient/gi)) {
        $ingredientURL = $firstMatch.find("a").attr("href");
        this.ingredientURL = `${constants.urls.base}${$ingredientURL}`;
      }
    }
    return this;
  }

  async getIngredientDetails() {
    if (!this.ingredientURL) {
      this.ingredientNotFound = true;
      return this;
    }

    const $ = await this.fetchData(this.ingredientURL);
    this.summary = new SummaryParser($).build();
    return this;
  }

  async build() {
    return (await this.setIngredientURL()).getIngredientDetails();
  }
}
