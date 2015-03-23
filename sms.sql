BEGIN;

CREATE TABLE phone (
	id  			bigserial				NOT NULL,
	person			text					NOT NULL,
	number			text					NOT NULL UNIQUE,

	PRIMARY KEY(id),
	FOREIGN KEY (person_id) REFERENCES person(id)
);

CREATE TABLE text (
	id  			bigserial				NOT NULL,
	phone_id		bigint					NOT NULL,
	time_stamp		timestamp				NOT NULL,
	message			text,


	FOREIGN KEY (phone_id) REFERENCES phone(id)
);


SELECT phone_id, count(phone_id) AS count 
FROM text 
GROUP BY phone_id 
ORDER BY count;

-- List the number of texts sent by each person
SELECT person, count(phone_id) AS count 
FROM phone, text 
WHERE phone.id = text.phone_id 
GROUP BY phone_id 
ORDER BY count DESC;

SELECT person, time_stamp, message 
FROM phone, text 
WHERE text.phone_id = phone.id 
	AND date(time_stamp) = '2013-02-02' 
ORDER BY datetime(time_stamp);

-- LIst the number of texts sent by each person on February 2nd 2013
SELECT person, count(phone_id) AS count 
FROM phone, text 
WHERE phone.id = text.phone_id 
	AND date(time_stamp) = '2013-02-02' 
GROUP BY phone_id 
ORDER BY count DESC;


-- texts by user by day
SELECT phone_id, date(time_stamp) as day, count(phone_id) as count FROM text GROUP BY phone_id, day ORDER BY day;

-- Cross Product of dates and people
WITH dates AS (
		SELECT DISTINCT date(time_stamp) AS date 
		FROM text 
		ORDER BY date(time_stamp)
	), people AS (
		SELECT id AS person 
		FROM phone
	) 
SELECT person, date 
FROM people 
CROSS JOIN dates;


-- Number of texts sent per person by day
WITH dates AS (
		SELECT DISTINCT date(time_stamp) AS date 
		FROM text 
		ORDER BY date(time_stamp)
	), people AS (
		SELECT id AS person 
		FROM phone
	), people_dates AS (
		SELECT person, date 
		FROM people 
		CROSS JOIN dates
	), user_counts AS (
		SELECT phone_id, date(time_stamp) as day, count(phone_id) as count
		FROM text
		GROUP BY phone_id, day
	)
SELECT person, date, count
FROM people_dates
LEFT JOIN user_counts
ON people_dates.person = user_counts.phone_id
	AND people_dates.date = user_counts.day;


