"""
Lifestyle Planner Database — Condition-specific meal plans and exercise routines.

Provides 7-day overview meal templates and exercise prescriptions
tailored to common chronic conditions.

DISCLAIMER: For educational purposes only.
Consult a registered dietitian and physician before making dietary changes.
"""

# ── Meal Plan Templates ────────────────────────────────────────────────

MEAL_PLANS = {
    "Hypertension": {
        "diet_name": "DASH Diet (Dietary Approaches to Stop Hypertension)",
        "daily_calories_range": (1800, 2200),
        "key_principles": [
            "Limit sodium to < 2,300 mg/day (ideal: < 1,500 mg)",
            "Emphasize potassium, magnesium, and calcium-rich foods",
            "At least 4-5 servings of fruits and vegetables per day",
            "Choose whole grains over refined carbohydrates",
            "Limit saturated fat and avoid trans fats",
            "Reduce red meat; emphasize fish and poultry",
        ],
        "foods_to_emphasize": [
            "Leafy greens (spinach, kale)", "Berries", "Bananas",
            "Avocados", "Low-fat dairy (yogurt, milk)", "Oats",
            "Brown rice", "Salmon and mackerel", "Beans and lentils",
            "Nuts (unsalted)", "Olive oil"
        ],
        "foods_to_avoid": [
            "Table salt and salty snacks", "Processed meats",
            "Canned soups (high sodium)", "Fast food", "Pickled foods",
            "Full-fat dairy", "Sugary beverages"
        ],
        "weekly_plan": [
            {
                "day": "Monday",
                "breakfast": "Oatmeal with berries and skim milk (low-sodium)",
                "lunch": "Grilled salmon salad with olive oil dressing, whole grain roll",
                "dinner": "Baked chicken breast, steamed broccoli, brown rice",
                "snacks": "Banana + handful of unsalted almonds"
            },
            {
                "day": "Tuesday",
                "breakfast": "Greek yogurt with sliced banana and walnuts",
                "lunch": "Lentil soup with whole grain bread, side salad",
                "dinner": "Stir-fried tofu with vegetables and brown rice",
                "snacks": "Apple + low-fat string cheese"
            },
            {
                "day": "Wednesday",
                "breakfast": "Whole grain toast with avocado and poached egg",
                "lunch": "Turkey and vegetable wrap (no-salt seasoning)",
                "dinner": "Baked mackerel with roasted asparagus and quinoa",
                "snacks": "Mixed berries + handful of walnuts"
            },
            {
                "day": "Thursday",
                "breakfast": "Smoothie: spinach, banana, berries, low-fat milk",
                "lunch": "Black bean and vegetable burrito bowl (brown rice base)",
                "dinner": "Grilled chicken with sweet potato and steamed kale",
                "snacks": "Orange + unsalted pumpkin seeds"
            },
            {
                "day": "Friday",
                "breakfast": "Oatmeal with sliced almonds, cinnamon, and apple",
                "lunch": "Tuna salad (no added salt) on whole grain bread, cucumber slices",
                "dinner": "Shrimp stir-fry with vegetables and brown rice",
                "snacks": "Celery with natural peanut butter (unsalted)"
            },
            {
                "day": "Saturday",
                "breakfast": "Whole grain pancakes with fresh berries (no syrup)",
                "lunch": "Lentil and vegetable curry with brown rice",
                "dinner": "Baked salmon with lemon, roasted Brussels sprouts, quinoa",
                "snacks": "Mango slices + handful of cashews (unsalted)"
            },
            {
                "day": "Sunday",
                "breakfast": "Veggie egg scramble (low salt) with whole grain toast",
                "lunch": "Chickpea and spinach soup, whole grain crackers",
                "dinner": "Grilled lean beef (small portion), baked potato, green beans",
                "snacks": "Peach + low-fat yogurt"
            },
        ]
    },

    "Type 2 Diabetes": {
        "diet_name": "Low Glycemic Index (Low-GI) Carbohydrate-Controlled Diet",
        "daily_calories_range": (1600, 2000),
        "key_principles": [
            "Choose low-GI carbohydrates (GI < 55) to prevent blood sugar spikes",
            "Distribute carbohydrates evenly across 3 meals and 1-2 snacks",
            "Fill half the plate with non-starchy vegetables",
            "Choose lean proteins at every meal",
            "Limit added sugars and refined carbohydrates completely",
            "Include healthy fats (olive oil, avocado, nuts) in moderation",
        ],
        "foods_to_emphasize": [
            "Non-starchy vegetables (all leafy greens)", "Legumes (beans, lentils)",
            "Berries (low GI)", "Whole grains (oats, barley, quinoa)",
            "Lean proteins (chicken, fish, tofu)", "Nuts and seeds",
            "Greek yogurt (unsweetened)", "Olive oil", "Cinnamon (may improve insulin sensitivity)"
        ],
        "foods_to_avoid": [
            "White bread, white rice, white pasta", "Sugary drinks (soda, juice)",
            "Candy, cakes, cookies", "High-fat processed foods",
            "Sweetened breakfast cereals", "Dried fruits (high sugar density)",
            "Alcohol (causes blood sugar fluctuations)"
        ],
        "weekly_plan": [
            {
                "day": "Monday",
                "breakfast": "Steel-cut oats with chia seeds, cinnamon, and a few blueberries",
                "lunch": "Grilled chicken breast with large salad (vinegar dressing) and barley",
                "dinner": "Baked cod with roasted cauliflower and lentils",
                "snacks": "Celery with 2 tbsp peanut butter; handful of almonds"
            },
            {
                "day": "Tuesday",
                "breakfast": "Scrambled eggs with sautéed spinach and mushrooms",
                "lunch": "Lentil and vegetable soup, small whole grain roll",
                "dinner": "Grilled salmon with steamed broccoli and quinoa",
                "snacks": "Greek yogurt (plain, unsweetened) with a few berries"
            },
            {
                "day": "Wednesday",
                "breakfast": "Greek yogurt parfait: unsweetened yogurt, walnuts, berries",
                "lunch": "Turkey lettuce wraps with avocado, tomato, cucumber",
                "dinner": "Baked chicken thigh with roasted zucchini and farro",
                "snacks": "Apple (small, low-GI variety) with 1 oz cheese"
            },
            {
                "day": "Thursday",
                "breakfast": "Veggie omelet (2 eggs, peppers, onions, spinach)",
                "lunch": "Tuna salad stuffed in bell peppers (no bread)",
                "dinner": "Shrimp with stir-fried vegetables over cauliflower rice",
                "snacks": "Handful of mixed nuts; cucumber slices with hummus"
            },
            {
                "day": "Friday",
                "breakfast": "Smoothie: unsweetened almond milk, spinach, chia seeds, half a banana",
                "lunch": "Black bean and chicken bowl with salsa and greens (no rice)",
                "dinner": "Beef stir-fry with broccoli, snow peas, low-sodium soy sauce, brown rice (small portion)",
                "snacks": "Hard-boiled egg; celery sticks"
            },
            {
                "day": "Saturday",
                "breakfast": "Whole grain toast (1 slice) with avocado and smoked salmon",
                "lunch": "Chickpea and vegetable curry (small portion over greens, not rice)",
                "dinner": "Grilled turkey burger (no bun) with roasted sweet potato and salad",
                "snacks": "Low-fat cottage cheese with a few strawberries"
            },
            {
                "day": "Sunday",
                "breakfast": "Baked egg cups with vegetables and feta",
                "lunch": "Large salad with grilled tofu, chickpeas, mixed greens, olive oil dressing",
                "dinner": "Slow-cooked chicken and vegetable stew (low GI vegetables)",
                "snacks": "Mixed seeds + a pear"
            },
        ]
    },

    "Coronary Artery Disease": {
        "diet_name": "Heart-Healthy Mediterranean Diet",
        "daily_calories_range": (1800, 2200),
        "key_principles": [
            "Emphasize omega-3 fatty acids from fish (2+ servings per week)",
            "Use olive oil as primary fat source",
            "Abundant fruits, vegetables, and whole grains",
            "Limit saturated fat to < 7% of total calories",
            "Completely avoid trans fats",
            "Limit dietary cholesterol to < 200 mg/day",
            "Limit sodium to < 2,000 mg/day",
        ],
        "foods_to_emphasize": [
            "Fatty fish (salmon, sardines, mackerel)", "Olive oil",
            "Nuts and seeds (especially walnuts)", "Legumes",
            "Whole grains", "All vegetables", "Fruits",
            "Lean poultry (limited)", "Red wine (optional, 1 glass/day maximum)",
            "Herbs and spices (instead of salt)"
        ],
        "foods_to_avoid": [
            "Red and processed meats", "Butter and full-fat dairy",
            "Trans fats (partially hydrogenated oils)", "Fried foods",
            "Sugary foods and beverages", "Refined carbohydrates",
            "Excess alcohol"
        ],
        "weekly_plan": [
            {"day": "Monday", "breakfast": "Whole grain toast with olive oil, tomato, and feta", "lunch": "Mediterranean salad with grilled tuna, olives, vegetables", "dinner": "Baked salmon with lemon, roasted vegetables, quinoa", "snacks": "Walnuts; an apple"},
            {"day": "Tuesday", "breakfast": "Oatmeal with flaxseeds, almonds, and berries", "lunch": "Lentil soup with whole grain bread and olive oil", "dinner": "Grilled chicken with roasted Mediterranean vegetables, brown rice", "snacks": "Hummus with vegetable sticks"},
            {"day": "Wednesday", "breakfast": "Greek yogurt with honey, walnuts, and pomegranate", "lunch": "Grilled sardines with salad and whole grain crackers", "dinner": "Pasta (whole grain) with olive oil, garlic, vegetables, and grilled shrimp", "snacks": "Orange; handful of almonds"},
            {"day": "Thursday", "breakfast": "Smoothie with spinach, banana, ground flaxseed, almond milk", "lunch": "Chickpea and vegetable stew", "dinner": "Baked cod with roasted asparagus and quinoa pilaf", "snacks": "Dates (2-3) and walnuts"},
            {"day": "Friday", "breakfast": "Whole grain cereal with plant milk and berries", "lunch": "Avocado and vegetable wrap (whole grain)", "dinner": "Grilled mackerel with tabbouleh and roasted peppers", "snacks": "Apple with almond butter"},
            {"day": "Saturday", "breakfast": "Shakshuka (eggs in tomato sauce) with whole grain bread", "lunch": "Greek salad with grilled chicken (small portion) and pita", "dinner": "Baked halibut with olive oil, lemon, capers, and roasted zucchini", "snacks": "Mixed nuts; grapes"},
            {"day": "Sunday", "breakfast": "Avocado toast on whole grain with smoked salmon and capers", "lunch": "Minestrone soup with vegetables and beans", "dinner": "Lean lamb chops (small), tabbouleh, roasted vegetables", "snacks": "Walnuts; pear"},
        ]
    },

    "General": {
        "diet_name": "Balanced Whole Foods Diet",
        "daily_calories_range": (2000, 2500),
        "key_principles": [
            "Eat a variety of whole, minimally processed foods",
            "Fill half your plate with fruits and vegetables",
            "Choose whole grains over refined grains",
            "Include lean protein at every meal",
            "Stay hydrated with water (8+ glasses/day)",
            "Limit added sugars to < 25g/day (women) / < 36g/day (men)",
            "Limit sodium to < 2,300 mg/day",
        ],
        "foods_to_emphasize": [
            "All vegetables and fruits", "Whole grains", "Legumes",
            "Lean proteins (fish, poultry, eggs, tofu)", "Low-fat dairy",
            "Nuts and seeds", "Olive oil", "Water and herbal teas"
        ],
        "foods_to_avoid": [
            "Ultra-processed foods", "Sugary beverages", "Excess sodium",
            "Trans fats", "Excessive alcohol", "Large portions of red meat"
        ],
        "weekly_plan": [
            {"day": "Monday", "breakfast": "Oatmeal with fruit and nuts", "lunch": "Large salad with grilled chicken and whole grain roll", "dinner": "Baked fish with vegetables and brown rice", "snacks": "Apple; handful of nuts"},
            {"day": "Tuesday", "breakfast": "Whole grain toast with eggs and fruit", "lunch": "Lentil soup and whole grain bread", "dinner": "Stir-fried tofu with vegetables and brown rice", "snacks": "Greek yogurt; carrot sticks"},
            {"day": "Wednesday", "breakfast": "Smoothie with fruits, vegetables, and protein", "lunch": "Turkey sandwich on whole grain with salad", "dinner": "Grilled salmon with roasted vegetables and quinoa", "snacks": "Banana; almonds"},
            {"day": "Thursday", "breakfast": "Yogurt parfait with granola and berries", "lunch": "Chickpea and vegetable wrap", "dinner": "Chicken stew with vegetables and whole grain roll", "snacks": "Orange; hummus with pita"},
            {"day": "Friday", "breakfast": "Whole grain cereal with milk and fruit", "lunch": "Tuna salad with whole grain crackers and vegetables", "dinner": "Shrimp pasta with vegetables (whole grain pasta)", "snacks": "Peach; mixed nuts"},
            {"day": "Saturday", "breakfast": "Veggie omelet with whole grain toast", "lunch": "Bean and vegetable burrito bowl", "dinner": "Baked chicken with sweet potato and greens", "snacks": "Mango; sunflower seeds"},
            {"day": "Sunday", "breakfast": "Pancakes (whole grain) with fresh fruit", "lunch": "Vegetable and bean soup", "dinner": "Lean beef stir-fry with vegetables and brown rice", "snacks": "Berries; walnuts"},
        ]
    }
}


# ── Exercise Plans ─────────────────────────────────────────────────────

EXERCISE_PLANS = {
    "Hypertension": {
        "plan_name": "Blood Pressure Reduction Exercise Protocol",
        "weekly_goal": "150 minutes moderate-intensity aerobic exercise",
        "key_notes": [
            "Aerobic exercise can reduce systolic BP by 5-8 mmHg",
            "Monitor blood pressure before and after exercise",
            "Avoid high-intensity exercise if BP > 180/110 mmHg",
            "Breathe continuously during resistance exercises (never hold breath)",
            "Cool down slowly to prevent post-exercise hypotension",
        ],
        "routine": [
            {"day": "Monday", "type": "Aerobic", "activity": "Brisk walking or cycling", "duration": "30 minutes", "intensity": "Moderate (talk test: can speak in sentences)", "notes": "Warm up 5 min, cool down 5 min"},
            {"day": "Tuesday", "type": "Strength", "activity": "Light resistance training (bands or light weights)", "duration": "25 minutes", "intensity": "Light-moderate (never hold breath)", "notes": "Focus on major muscle groups; 2 sets × 12 reps"},
            {"day": "Wednesday", "type": "Flexibility", "activity": "Yoga or gentle stretching", "duration": "30 minutes", "intensity": "Light", "notes": "Excellent for stress reduction, which also lowers BP"},
            {"day": "Thursday", "type": "Aerobic", "activity": "Swimming or water aerobics", "duration": "30 minutes", "intensity": "Moderate", "notes": "Water pressure helps venous return; excellent for BP"},
            {"day": "Friday", "type": "Aerobic", "activity": "Stationary bike or elliptical", "duration": "30 minutes", "intensity": "Moderate", "notes": "Maintain steady pace; use heart rate monitor if available"},
            {"day": "Saturday", "type": "Combined", "activity": "Group exercise class (Zumba, aerobic dance)", "duration": "45 minutes", "intensity": "Moderate", "notes": "Social exercise improves adherence"},
            {"day": "Sunday", "type": "Rest/Recovery", "activity": "Leisurely walk in nature or gentle yoga", "duration": "20-30 minutes", "intensity": "Very light", "notes": "Active recovery; avoid complete sedentary rest"},
        ]
    },

    "Type 2 Diabetes": {
        "plan_name": "Glycemic Control Exercise Protocol",
        "weekly_goal": "150+ minutes aerobic + 2-3 resistance sessions",
        "key_notes": [
            "Exercise increases insulin sensitivity for up to 24-48 hours",
            "Check blood glucose before exercise; treat if < 100 mg/dL",
            "Carry fast-acting glucose (glucose tablets) during exercise",
            "No more than 2 consecutive days without exercise",
            "Resistance training preserves muscle mass and improves glucose uptake",
        ],
        "routine": [
            {"day": "Monday", "type": "Aerobic", "activity": "Brisk walking or cycling", "duration": "35 minutes", "intensity": "Moderate (50-70% max HR)", "notes": "Check glucose before; do not exercise if < 100 or > 300 mg/dL"},
            {"day": "Tuesday", "type": "Strength", "activity": "Resistance training (machines or free weights)", "duration": "30 minutes", "intensity": "Moderate", "notes": "8-10 exercises, 2-3 sets × 10-15 reps; rest 90 sec between sets"},
            {"day": "Wednesday", "type": "Aerobic", "activity": "Swimming or water aerobics", "duration": "30 minutes", "intensity": "Moderate", "notes": "Excellent for those with neuropathy or foot issues"},
            {"day": "Thursday", "type": "Flexibility + Balance", "activity": "Yoga, tai chi, or stretching", "duration": "30 minutes", "intensity": "Light-moderate", "notes": "Yoga has shown independent glucose-lowering effects"},
            {"day": "Friday", "type": "Strength", "activity": "Resistance bands, bodyweight exercises", "duration": "30 minutes", "intensity": "Moderate", "notes": "Squats, lunges, push-ups, rows — functional movements"},
            {"day": "Saturday", "type": "Aerobic", "activity": "Hiking, cycling, or active sport", "duration": "45-60 minutes", "intensity": "Moderate", "notes": "Monitor glucose every 30 min during prolonged exercise"},
            {"day": "Sunday", "type": "Recovery", "activity": "Gentle stretching or leisurely walk", "duration": "20 minutes", "intensity": "Light", "notes": "Even light walking after meals improves postprandial glucose"},
        ]
    },

    "Coronary Artery Disease": {
        "plan_name": "Cardiac Rehabilitation Exercise Protocol",
        "weekly_goal": "150 minutes moderate aerobic (under physician supervision initially)",
        "key_notes": [
            "Begin with formal cardiac rehabilitation program if recently diagnosed",
            "Monitor heart rate — target 50-70% of maximum heart rate",
            "Stop immediately if chest pain, severe shortness of breath, or dizziness occurs",
            "Avoid exercise in extreme heat/cold",
            "Progress gradually over 6-12 weeks",
        ],
        "routine": [
            {"day": "Monday", "type": "Aerobic", "activity": "Walking (flat surface)", "duration": "20-30 minutes", "intensity": "Light-moderate (RPE 11-13 on Borg scale)", "notes": "Start at 20 min; gradually increase to 30+ over weeks"},
            {"day": "Tuesday", "type": "Rest or Light", "activity": "Gentle stretching or tai chi", "duration": "20 minutes", "intensity": "Very light", "notes": "Focus on flexibility and relaxation"},
            {"day": "Wednesday", "type": "Aerobic", "activity": "Stationary cycling (low resistance)", "duration": "25 minutes", "intensity": "Moderate", "notes": "Cycling has low impact; excellent for cardiac patients"},
            {"day": "Thursday", "type": "Strength (Light)", "activity": "Light resistance bands or bodyweight (upper body focus)", "duration": "20 minutes", "intensity": "Very light — only after physician clearance", "notes": "Never hold breath; avoid heavy lifting"},
            {"day": "Friday", "type": "Aerobic", "activity": "Water walking or swimming (low intensity)", "duration": "25-30 minutes", "intensity": "Light-moderate", "notes": "Water exercise reduces cardiac workload"},
            {"day": "Saturday", "type": "Aerobic", "activity": "Gardening, walking, light recreational activity", "duration": "30 minutes", "intensity": "Moderate", "notes": "Enjoyable activities improve long-term adherence"},
            {"day": "Sunday", "type": "Rest", "activity": "Complete rest or very gentle stretching", "duration": "15 minutes", "intensity": "Very light", "notes": "Recovery is essential for cardiac adaptation"},
        ]
    },

    "General": {
        "plan_name": "WHO Physical Activity Guidelines (General Health)",
        "weekly_goal": "150-300 minutes moderate aerobic + 2 strength sessions",
        "key_notes": [
            "Any exercise is better than none — start where you are",
            "Gradually increase duration, frequency, then intensity",
            "Include aerobic, strength, flexibility, and balance training",
            "Find activities you enjoy for long-term adherence",
            "Reduce sitting time; break up sedentary periods every hour",
        ],
        "routine": [
            {"day": "Monday", "type": "Aerobic", "activity": "Brisk walking, jogging, or cycling", "duration": "30 minutes", "intensity": "Moderate", "notes": "Aim for 150+ min/week total"},
            {"day": "Tuesday", "type": "Strength", "activity": "Full-body resistance training", "duration": "30 minutes", "intensity": "Moderate", "notes": "All major muscle groups; 2-3 sets × 12 reps"},
            {"day": "Wednesday", "type": "Aerobic", "activity": "Swimming, dancing, or team sport", "duration": "30 minutes", "intensity": "Moderate", "notes": "Vary activities for motivation"},
            {"day": "Thursday", "type": "Flexibility", "activity": "Yoga or stretching routine", "duration": "30 minutes", "intensity": "Light", "notes": "Improves mobility and reduces injury risk"},
            {"day": "Friday", "type": "Strength", "activity": "Resistance training or HIIT (if fit)", "duration": "30 minutes", "intensity": "Moderate-high", "notes": "Focus on progressive overload"},
            {"day": "Saturday", "type": "Active Recreation", "activity": "Hiking, cycling, sports, outdoor activities", "duration": "45-60 minutes", "intensity": "Moderate", "notes": "Weekends for longer, enjoyable activities"},
            {"day": "Sunday", "type": "Rest/Recovery", "activity": "Light walking, stretching, foam rolling", "duration": "20 minutes", "intensity": "Light", "notes": "Rest and recovery are part of the program"},
        ]
    }
}


def generate_lifestyle_plan(condition: str, age: int = None, sex: str = None, bmi: float = None) -> dict:
    """
    Generate a personalized lifestyle plan for a given condition.
    """
    # Map condition to closest template
    condition_map = {
        "hypertension": "Hypertension",
        "high blood pressure": "Hypertension",
        "type 2 diabetes": "Type 2 Diabetes",
        "diabetes": "Type 2 Diabetes",
        "coronary artery disease": "Coronary Artery Disease",
        "heart disease": "Coronary Artery Disease",
        "cad": "Coronary Artery Disease",
    }

    template_key = condition_map.get(condition.lower(), "General")
    meal_template = MEAL_PLANS.get(template_key, MEAL_PLANS["General"])
    exercise_template = EXERCISE_PLANS.get(template_key, EXERCISE_PLANS["General"])

    # BMI-based caloric adjustment
    calorie_min, calorie_max = meal_template["daily_calories_range"]
    calorie_note = ""
    if bmi is not None:
        if bmi > 30:
            calorie_min = int(calorie_min * 0.85)
            calorie_max = int(calorie_max * 0.85)
            calorie_note = "Caloric targets adjusted downward for weight management (BMI > 30)."
        elif bmi < 18.5:
            calorie_min = int(calorie_min * 1.1)
            calorie_max = int(calorie_max * 1.1)
            calorie_note = "Caloric targets adjusted upward to support healthy weight gain (BMI < 18.5)."

    # Age-based exercise modification
    exercise_notes = list(exercise_template["key_notes"])
    if age is not None:
        if age >= 65:
            exercise_notes.append("For 65+ years: Focus on balance exercises to prevent falls. Tai chi and water aerobics are excellent options.")
            exercise_notes.append("Strength training is especially important for preserving muscle mass and bone density in older adults.")
        elif age < 30:
            exercise_notes.append("At your age, higher-intensity exercise is appropriate if you have no other contraindications.")

    return {
        "condition": condition,
        "template_used": template_key,
        "meal_plan": {
            "diet_name": meal_template["diet_name"],
            "daily_calories": f"{calorie_min}–{calorie_max} kcal",
            "calorie_note": calorie_note,
            "key_principles": meal_template["key_principles"],
            "foods_to_emphasize": meal_template["foods_to_emphasize"],
            "foods_to_avoid": meal_template["foods_to_avoid"],
            "weekly_plan": meal_template["weekly_plan"],
        },
        "exercise_plan": {
            "plan_name": exercise_template["plan_name"],
            "weekly_goal": exercise_template["weekly_goal"],
            "key_notes": exercise_notes,
            "routine": exercise_template["routine"],
        },
        "disclaimer": (
            "This lifestyle plan is generated for educational purposes only. "
            "Consult a registered dietitian for a personalized meal plan and your physician "
            "before starting any new exercise program, especially if you have a chronic condition."
        )
    }
