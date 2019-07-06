import * as log4js from "log4js";

const logger = log4js.getLogger();

export class SummaryParser {
  constructor($) {
    this.$ = $;
    this.summary = {};
  }

  getAdditionalInfo() {
    const additionalNotes = this.$(".additional_notes2012");
    if (additionalNotes.length) {
      return additionalNotes
        .text()
        .split(";")
        .map(str => {
          return {
            key: str.split(":")[0].trim(),
            value: str.split(":")[1].trim()
          };
        });
    }
  }

  getTinyTypeContent(text, match) {
    try {
      const $tinyTypeMatch = match || this.$(`.tinytype>*:contains('${text}')`);
      if ($tinyTypeMatch.length) {
        return $tinyTypeMatch
          .parent()
          .text()
          .split(":")[1]
          .replace(/\s*;\s*/gi, ";")
          .trim();
      }
    } catch (ex) {
      logger.error(ex);
    }
  }

  setAbout() {
    this.summary.about = this.getTinyTypeContent(
      "About",
      this.$(`.tinytype#ABOUTmore>*:contains('About')`)
    );
    return this;
  }

  setFunction() {
    try {
      this.summary.function = this.getTinyTypeContent("Function").split(";");
    } catch (ex) {
      logger.error(ex);
    }
    return this;
  }

  setSynonyms() {
    try {
      this.summary.synonyms = this.getTinyTypeContent("Synonym").split(";");
    } catch (ex) {
      logger.error(ex);
    }
    return this;
  }

  setConcerns() {
    let concerns = [];
    try {
      const additionalInfo = this.getAdditionalInfo();
      if (additionalInfo) {
        concerns = concerns.concat(additionalInfo);
      }
    } catch (ex) {
      logger.error(ex);
    }
    this.summary.concerns = concerns;
    return this;
  }

  setHarzard() {
    let hazard = "unknown";
    if (this.summary.score > 0 && this.summary.score <= 2) {
      hazard = "low";
    } else if (this.summary.score > 2 && this.summary.score <= 6) {
      hazard = "moderate";
    } else if (this.summary.score > 6 && this.summary.score <= 10) {
      hazard = "high";
    }
    this.summary.hazard = hazard;
    return this;
  }

  setScore() {
    try {
      const $scoreDiv = this.$(this.$(".individualbar_col2 .basic_bar")[0]);
      if ($scoreDiv) {
        const score = Math.ceil(
          ($scoreDiv.attr("style").match(/\d+/)[0] / 190) * 10
        );
        this.summary.score = score <= 10 ? score : 0;
      }
    } catch (ex) {
      logger.error(ex);
    }
    return this;
  }

  build() {
    this.setScore()
      .setHarzard()
      .setConcerns()
      .setFunction()
      .setSynonyms()
      .setAbout();
    return this.summary;
  }
}
