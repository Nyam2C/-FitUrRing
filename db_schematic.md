- USER
    - user_id (PK)
    - user_password
    - user_name
    - user_gender
    - user_age
    - user_email
    - user_phone
    - user_created_at
    - user_last_login

- ROUTINE
    - routine_id (PK)
    - user_id (FK)
    - routine_name
    - routine_created_at

- ROUTINE_COMPONENT
    - component_id (PK)
    - routine_id (FK)
    - video_id (FK)
    - component_sets

- VIDEO
    - video_id (PK)
    - video_title
    - video_description
    - video_tag
    - video_url

- MUSCLE
    - muscle_id (PK)
    - muscle_name
    - muscle_info
    - muscle_tag

- FOOD_100G
    - food_id (PK)
    - food_name
    - energy_kcal
    - carbohydrate
    - protein
    - fat
    - dietary_fiber
    - sugar
    - salt
    - vitamin
    - mineral
