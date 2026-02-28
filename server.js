const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

const filePath = path.join(__dirname, "habits.json");
console.log("Using file:", filePath);
// Read habits
function getHabits() {
  const data = fs.readFileSync(filePath);
  return JSON.parse(data);
}

// Save habits
function saveHabits(habits) {
  fs.writeFileSync(filePath, JSON.stringify(habits, null, 2));
}

// Get all habits
app.get("/habits", (req, res) => {
  res.json(getHabits());
});

// Add new habit
app.post("/habits", (req, res) => {
  const habits = getHabits();

  const newHabit = {
    id: Date.now(),
    name: req.body.habit,
    completed: false,
    streak: 0
  };

  habits.push(newHabit);
  saveHabits(habits);

  res.json(newHabit);
});

// Toggle complete
app.put("/habits/:id", (req, res) => {
  const habits = getHabits();
  const habit = habits.find(h => h.id == req.params.id);

  if (habit) {
    habit.completed = !habit.completed;
    if (habit.completed) {
      habit.streak += 1;
    }
    saveHabits(habits);
    res.json(habit);
  }
});

// Delete habit
app.delete("/habits/:id", (req, res) => {
  let habits = getHabits();
  habits = habits.filter(h => h.id != req.params.id);
  saveHabits(habits);
  res.json({ message: "Deleted" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});