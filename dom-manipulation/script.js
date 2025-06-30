const displayQuote = document.getElementById("quoteDisplay");
const quoteBtn = document.getElementById("newQuote");
const formContainer = document.getElementById("formContainer");

// Saving random quote in local storage
const saveQuotes = () => {
    localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Upload quotes from local storage
const quotes = JSON.parse(localStorage.getItem("quotes")) || [
    {
        category: "Inspiration",
        text: "Happiness is not something ready made. It comes from your own actions."
    },
    {
        category: "Love ",
        text: "You, yourself, as much as anybody in the entire universe, deserve your love and affection."
    },
    {
        category: "Motivational",
        text: "The only person you are destined to become is the person you decide to be."
    },
    {
        category: "Funny",
        text: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe."
    }
];

const populateCategories = () => {
    const categoryFilter = document.getElementById("categoryFilter");
    categoryFilter.innerHTML = "";
    const option = document.createElement("option");
    option.value = "all";
    option.textContent = "All Categories";
    categoryFilter.appendChild(option);
    const uniqueCategory = [...new Set(quotes.map(q => q.category))];
    console.log(uniqueCategory)
    uniqueCategory.map(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryFilter.appendChild(option);
    });
}

const filterQuotes = () => {
    quoteDisplay.innerHTML = "";
    const selectedCategory = categoryFilter.value;
    console.log(selectedCategory);

    const filtered = selectedCategory === "all"
        ? quotes
        : quotes.filter(q => q.category === selectedCategory);

    if (filtered.length === 0) {
        quoteDisplay.textContent = "No quotes available in this category.";
        return;
    }

    const randomIndex = Math.floor(Math.random() * filtered.length);
    quoteDisplay.textContent = filtered[randomIndex].text;
}

const exportToJsonFile = () => {
    const dataString = JSON.stringify(quotes, null, 4);
    const blob = new Blob([dataString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();

    URL.revokeObjectURL(url);
}

const importFromJsonFile = (event) => {
  const fileReader = new FileReader();
  fileReader.onload = (event) => {
    try {
      const importedQuotes = JSON.parse(event.target.result);

      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes.filter(q => typeof q === "string" && q.trim()));
        saveQuotes();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid format: JSON must be an array of strings.");
      }
    } catch (err) {
      alert("Error reading JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Display random quote
const showRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    quoteDisplay.innerHTML = `"${quotes[randomIndex].text}" — ${quotes[randomIndex].category}`;
}

// Input for random quote
const createAddQuoteForm = () => {
    const textInput = document.createElement("input");
    textInput.type = "text";
    textInput.id = "newQuoteText";
    textInput.placeholder = "Enter a new quote";

    const categoryInput = document.createElement("input");
    categoryInput.type = "text";
    categoryInput.id = "newQuoteCategory";
    categoryInput.placeholder = "Enter quote category";

    const addButton = document.createElement("button");
    addButton.textContent = "Add Quote";
    addButton.id = "addQuoteBtn";
    addButton.addEventListener("click", addQuote);

    formContainer.appendChild(textInput);
    formContainer.appendChild(categoryInput);
    formContainer.appendChild(addButton);
}

// Creating random quote
const addQuote = () => {
    const newQuote = document.getElementById("newQuoteText");
    const newQuoteCategory = document.getElementById("newQuoteCategory");

    const newText = newQuote.value.trim();
    const newCategory = newQuoteCategory.value.trim();

    if (!newText || !newCategory) {
        alert("Please fill in both fields.");
        return;
    }

    quotes.push({ category: newCategory, text: newText });
    populateCategories()
    saveQuotes()
    newQuote.value = "";
    newQuoteCategory.value = "";
    alert("Quote added successfully!");
}

populateCategories()
quoteBtn.addEventListener("click", showRandomQuote);
createAddQuoteForm()