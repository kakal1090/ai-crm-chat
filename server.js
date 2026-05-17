require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");

const app = express();

app.use(cors());
app.use(express.json());

/*
|--------------------------------------------------------------------------
| SUPABASE
|--------------------------------------------------------------------------
*/

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

/*
|--------------------------------------------------------------------------
| TEST API
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "CRM API Running",
  });
});

/*
|--------------------------------------------------------------------------
| SAVE CHAT
|--------------------------------------------------------------------------
*/

app.post("/save-chat", async (req, res) => {
  try {
    const { conversation_id, user_message } = req.body;

    /*
    |--------------------------------------------------------------------------
    | VALIDATION
    |--------------------------------------------------------------------------
    */

    if (!conversation_id || !user_message) {
      return res.status(400).json({
        success: false,
        message: "conversation_id và user_message là bắt buộc",
      });
    }

    console.log("=================================");
    console.log("NEW MESSAGE");
    console.log("Conversation ID:", conversation_id);
    console.log("Message:", user_message);
    console.log("=================================");

    /*
    |--------------------------------------------------------------------------
    | INSERT DATABASE
    |--------------------------------------------------------------------------
    */

    const { data, error } = await supabase
      .from("chats")
      .insert([
        {
          conversation_id,
          user_message,
        },
      ])
      .select();

    /*
    |--------------------------------------------------------------------------
    | ERROR
    |--------------------------------------------------------------------------
    */

    if (error) {
      console.log("SUPABASE ERROR:");
      console.log(error);

      return res.status(500).json({
        success: false,
        message: "Database insert failed",
        error,
      });
    }

    /*
    |--------------------------------------------------------------------------
    | SUCCESS
    |--------------------------------------------------------------------------
    */

    return res.json({
      success: true,
      message: "Chat saved successfully",
      data,
    });
  } catch (err) {
    console.log("SERVER ERROR:");
    console.log(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
});

/*
|--------------------------------------------------------------------------
| SERVER
|--------------------------------------------------------------------------
*/

const PORT = 3000;

app.listen(PORT, () => {
  console.log("=================================");
  console.log(`Server running on port ${PORT}`);
  console.log("=================================");
});