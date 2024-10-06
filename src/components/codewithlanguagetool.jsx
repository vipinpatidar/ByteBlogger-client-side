export class CodeWithLanguageTool {
  constructor({ data, api }) {
    this.api = api;
    this.data = {
      code: data.code || "",
      language: data.language || "",
    };

    this.wrapper = undefined;
    this.codeTextarea = undefined; // To keep a reference to the textarea
  }

  // Render the tool's UI
  render() {
    this.wrapper = document.createElement("div");
    this.wrapper.classList.add("code-block-wrapper");
    this.wrapper.style.height = "auto";

    // Create textarea for the code input
    this.codeTextarea = document.createElement("textarea");
    this.codeTextarea.placeholder =
      "Enter your code here...  (Please format your code for better readability)";
    this.codeTextarea.value = this.data.code;
    this.codeTextarea.spellcheck = false;
    this.codeTextarea.classList.add("code-textarea");

    // Adjust textarea height based on content on initial render

    setTimeout(() => {
      this.adjustTextareaHeight();
    }, 0);

    // Listen for input and adjust height dynamically as you type
    this.codeTextarea.addEventListener("input", () => {
      this.data.code = this.codeTextarea.value;
      this.adjustTextareaHeight();
    });

    // Handle the "Enter" keypress to allow new lines without exiting the block
    this.codeTextarea.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        const start = this.codeTextarea.selectionStart;
        const end = this.codeTextarea.selectionEnd;
        this.data.code =
          this.data.code.substring(0, start) +
          "\n" +
          this.data.code.substring(end);
        this.codeTextarea.value = this.data.code;
        this.codeTextarea.selectionStart = this.codeTextarea.selectionEnd =
          start + 1;
        this.adjustTextareaHeight();
      }
    });

    // Create an input for the language selection
    const languageInput = document.createElement("input");
    languageInput.placeholder =
      "Enter language (e.g., javascript, jsx, sql, json, html, css)";
    languageInput.value = this.data.language;
    languageInput.classList.add("language-input");
    languageInput.addEventListener("input", (event) => {
      this.data.language = event.target.value;
    });

    // Append both elements to the wrapper
    this.wrapper.appendChild(languageInput);
    this.wrapper.appendChild(this.codeTextarea);

    return this.wrapper;
  }

  // Adjust the textarea height based on its content
  adjustTextareaHeight() {
    this.codeTextarea.style.height = "auto"; // Reset height
    this.codeTextarea.style.height = `${this.codeTextarea.scrollHeight}px`; // Set height to content
  }

  // Save the block data when Editor.js saves the content
  save(blockContent) {
    return {
      code: this.data.code, // Save the code text
      language: this.data.language, // Save the language text
    };
  }

  // Allow line breaks in the textarea
  static get enableLineBreaks() {
    return true;
  }

  // Tool configuration for Editor.js toolbox
  static get toolbox() {
    return {
      title: "Code",
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
</svg>
`,
    };
  }
}
