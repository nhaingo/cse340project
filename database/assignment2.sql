--1-- Create the assignment2.sql
--2-- Build and test SQL statements in pgAdmin using the course database
--3-- SQL statements to demonstrate CRUD interactions
	-- CREATE STATEMENTS --
		-- Create the table employee
			CREATE TABLE IF NOT EXISTS public.employee (
				employee_id INT NOT NULL,
				employee_lastname CHARACTER VARYING NOT NULL,
				employee_firstname CHARACTER VARYING,
				employee_phoneNumber CHARACTER(12)
			);
		--Insert values into the table employee
			INSERT INTO public.employee(
				employee_id,
				employee_lastname,
				employee_firstname,
				employee_phoneNumber
			)
			VALUES
				(103, 'Swanson', 'Patrick', '502-123-4567'),
				(104, 'Maya', 'Valery', '502-345-7894'),
				(105, 'Smith', 'Annick', '502-756-4321');
				
			SELECT * FROM public.employee;

		-- SELECT statements for users to read the results retrieved
			SELECT * FROM public.classification;
			SELECT * FROM public.inventory;
			SELECT inv_id, inv_make FROM public.inventory WHERE inv_id = 7;
			SELECT inv_id, classification_name, inv_make
				FROM public.classification pc
				JOIN public.inventory pi
				ON pc.classification_id = pi.classification_id;

		--UPDATE statements on the table employee
			UPDATE public.employee
			SET employee_phonenumber='504-345-7894'
				WHERE employee_id = 104;

		-- DELETE statements on the table employee
			DELETE FROM public.employee WHERE employee_id = 104;
			--Drop the table employee to restore the database t its initial structure
			DROP TABLE IF EXISTS public.employee CASCADE;
--4-- Store statements into assignment2.sql file
--5-- SQL statements to accomplish tasks
	--1-- INSERT a new record to the accounte table
INSERT INTO public.account 
	(account_firstname, account_lastname, account_email, account_password)
VALUES
	('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');
SELECT * FROM public.account;

	--2-- Modify the Tony Stark record to change the account_type to "Admin"
UPDATE public.account
SET account_type = 'Admin'
WHERE account_id = 1;

	--3-- Delete the Tony Stark record from the database
DELETE FROM public.account WHERE account_id = 1;

	--4-- Modify the "GM Hummer" record to read "a huge interior" instead of "small interiors" using a single query
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
	WHERE inv_make = 'GM' AND inv_model = 'Hummer';
	--(test if the code excecuted successfully)
		SELECT * FROM public.inventory 
			WHERE inv_make = 'GM' AND inv_model = 'Hummer';
			
	--5-- Inner join to select make and model from the inventory table and classification from the classification table
SELECT inv_make, inv_model, classification_name
FROM public. inventory pi
INNER JOIN public.classification pc
	ON pi.classification_id = pc.classification_id
WHERE classification_name = 'Sport';

	--6-- Update all records in the inventory table to add "/vehicles" to the middle of the path in the inv_image and inv_thumbnail
UPDATE public.inventory
SET inv_image = CONCAT('/images/vehicles/', SUBSTRING(inv_image FROM 9)),
    inv_thumbnail = CONCAT('/images/vehicles/', SUBSTRING(inv_thumbnail FROM 9));
	--(test the if the code is successful)
	SELECT inv_image, inv_thumbnail FROM public.inventory;