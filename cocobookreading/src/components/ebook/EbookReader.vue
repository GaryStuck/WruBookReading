<template>
  <div class="ebook-reader">
    <div id="read"></div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Epub from "epubjs";

global.epub = Epub;
export default {
  data() {
    return {
      radio: 1
    };
  },
  computed: {
    ...mapGetters(["fileName"])
  },
  methods: {
    nextPage() {
      if (this.rendition) {
        this.rendition.next();
      }
    },
    prevPage() {
      if (this.rendition) {
        this.rendition.prev();
      }
    },
    toggleTitleAndMenu() {
      console.log("toggleTitleAndMenu");
    },
    initEpub() {
      const baseUrl = "http://localhost:8081/epub/" + this.fileName + ".epub";
      this.book = new Epub(baseUrl, { openAs: "epub" });
      // 渲染电子书
      this.rendition = this.book.renderTo("read", {
        flow: "paginated",
        manager: "continuous",
        width: innerWidth,
        height: innerHeight,
        snap: true,
        method: "default"
      });
      this.rendition.display();
      this.rendition.on("touchstart", event => {
        this.touchStartX = event.changedTouches[0].clientX;
        this.touchStartTime = event.timeStamp;
      });
      this.rendition.on("touchend", event => {
        const offsetX = event.changedTouches[0].clientX - this.touchStartX;
        const time = event.timeStamp - this.touchStartTime;
        if (time < 500 && offsetX > 40) {
          this.prevPage();
        } else if (time < 500 && offsetX < -40) {
          this.nextPage();
        } else {
          this.toggleTitleAndMenu();
        }
        event.stopPropagation();
      });
    }
  },
  mounted() {
    const fileName = this.$route.params.fileName.split("|").join("/");
    this.$store.dispatch("setFileName", fileName).then(() => {
      this.initEpub();
    });
  }
};
</script>
