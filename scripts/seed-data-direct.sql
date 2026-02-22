-- Student Hub Bulk Seed Data
-- Instructions: Copy and paste this into your Supabase SQL Editor and run it.
-- This will add at least 20 entries to each table.

-- Note: Using existing user IDs from the profiles table.
DO $$
DECLARE
    user1 UUID := 'a61ab2d4-8b0c-42dc-9126-ecb71308024e';
    user2 UUID := '26e040fe-e652-4cc1-b687-636ad4e2fc29';
    user3 UUID := 'dba2643a-f252-41e6-afcb-0e077ee35310';
BEGIN

-- 1. ISSUES (22 total)
INSERT INTO issues (title, description, location, category, tags, user_id, upvotes, downvotes, reports, created_at)
VALUES 
('Poor Lighting in Block B Parking', 'The parking area in Block B is extremely dark after 7 PM. Many students feel unsafe.', 'Block B Parking', 'Infrastructure', ARRAY['Safety', 'Lighting'], user1, ARRAY[user2], ARRAY[]::uuid[], ARRAY[]::uuid[], NOW()),
('Consistent Wifi Outages in Library', 'The Student_Wifi frequently disconnects on the 3rd floor. Hindering research.', 'Main Library, 3rd Floor', 'Academics', ARRAY['Internet', 'Library'], user2, ARRAY[user1], ARRAY[]::uuid[], ARRAY[]::uuid[], NOW()),
('Canteen Food Quality Control', 'Need better hygiene standards in the main cafeteria. Reports of stale bread.', 'Main Canteen', 'Student Services', ARRAY['Food', 'Health'], user3, ARRAY[user1, user2], ARRAY[]::uuid[], ARRAY[]::uuid[], NOW()),
('Broken Lab Equipment in EEE', 'Digital oscilloscopes in EEE Lab 2 are not calibrated. Affecting practical exams.', 'Block A, Lab 2', 'Academics', ARRAY['Lab', 'EEE'], user1, ARRAY[]::uuid[], ARRAY[]::uuid[], ARRAY[]::uuid[], NOW()),
('Inadequate Seating in Study Hall', 'The 24/7 study hall is always full. Need more desks and chairs.', 'Student Center', 'Infrastructure', ARRAY['Study', 'Facilities'], user2, ARRAY[user3], ARRAY[]::uuid[], ARRAY[]::uuid[], NOW()),
('Water Purifier Filter Replacement', 'The water cooler in Block C tastes like chlorine. Filter needs change.', 'Block C, Ground Floor', 'Infrastructure', ARRAY['Water', 'Maintenance'], user3, ARRAY[]::uuid[], ARRAY[]::uuid[], ARRAY[]::uuid[], NOW()),
('Stray Dog Menace Near Hostel', 'Security needs to address the increasing number of aggressive dogs at night.', 'Girls Hostel Entrance', 'Campus', ARRAY['Safety', 'Security'], user1, ARRAY[user2, user3], ARRAY[]::uuid[], ARRAY[]::uuid[], NOW()),
('Lack of Sanitary Vending Machines', 'Female washrooms in Block A lack functional vending machines.', 'Block A Washrooms', 'Women Rights', ARRAY['Health', 'Women'], user2, ARRAY[]::uuid[], ARRAY[]::uuid[], ARRAY[]::uuid[], NOW()),
('Ragging Incident Near Sports Field', 'Witnessed senior students harassing juniors behind the pavilion.', 'Sports Complex', 'Ragging', ARRAY['Safety', 'Anti-Ragging'], user3, ARRAY[]::uuid[], ARRAY[]::uuid[], ARRAY[]::uuid[], NOW()),
('Cultural Event Funding Delay', 'The budget for the annual fest has not been released yet.', 'Admin Block', 'Fest', ARRAY['Finance', 'Culture'], user1, ARRAY[user2], ARRAY[]::uuid[], ARRAY[]::uuid[], NOW()),
('Basketball Court Net Replacement', 'The nets on the outdoor court are torn. Need official replacement.', 'Sports Ground', 'Sports', ARRAY['Sports', 'Equipment'], user2, ARRAY[]::uuid[], ARRAY[]::uuid[], ARRAY[]::uuid[], NOW()),
('Library Book Late Fee Discrepancy', 'The system is charging fines even on public holidays.', 'Library Admin', 'Academics', ARRAY['Library', 'Policy'], user3, ARRAY[]::uuid[], ARRAY[]::uuid[], ARRAY[]::uuid[], NOW()),
('Elevator Malfunction in Block D', 'Frequent trapping incidents in the main elevator. Needs urgent repair.', 'Block D', 'Infrastructure', ARRAY['Maintenance', 'Safety'], user1, ARRAY[user2, user3], ARRAY[]::uuid[], ARRAY[]::uuid[], NOW()),
('Course Feedback Anonymity', 'Need assurance that digital feedback forms are truly anonymous.', 'Online Portal', 'Teaching', ARRAY['Feedback', 'Policy'], user2, ARRAY[]::uuid[], ARRAY[]::uuid[], ARRAY[]::uuid[], NOW()),
('Sports Equip. Shortage for BT', 'The BT department lacks basic lab-to-field sports equipment.', 'Block A', 'Sports', ARRAY['Sports', 'Department'], user3, ARRAY[]::uuid[], ARRAY[]::uuid[], ARRAY[]::uuid[], NOW()),
('Washroom Hygiene in Block E', 'Block E toilets are not cleaned regularly. Strong odor in hallways.', 'Block E', 'Infrastructure', ARRAY['Hygiene', 'Facilities'], user1, ARRAY[user2], ARRAY[]::uuid[], ARRAY[]::uuid[], NOW()),
('Lack of Charging Points in Sem Hall', 'Need more power outlets for laptops during long seminars.', 'Main Seminar Hall', 'Infrastructure', ARRAY['Power', 'Tech'], user2, ARRAY[]::uuid[], ARRAY[]::uuid[], ARRAY[]::uuid[], NOW()),
('Shuttle Bus Frequency', 'Internal campus shuttle is too infrequent during peak hours.', 'Main Gate', 'Campus', ARRAY['Transport', 'Service'], user3, ARRAY[user1], ARRAY[]::uuid[], ARRAY[]::uuid[], NOW()),
('Placement Cell Response Time', 'Emails to the placement coordinator go unanswered for days.', 'Admin Block', 'Student Services', ARRAY['Career', 'Admin'], user1, ARRAY[]::uuid[], ARRAY[]::uuid[], ARRAY[]::uuid[], NOW()),
('Gym Equipment Maintenance', 'Treadmills in the student gym are out of order for 3 weeks.', 'Gymnasium', 'Sports', ARRAY['Health', 'Maintenance'], user2, ARRAY[user3], ARRAY[]::uuid[], ARRAY[]::uuid[], NOW()),
('Mosquito Menace in Library', 'Need pest control in the night reading section of the library.', 'Library', 'Campus', ARRAY['Health', 'Environment'], user3, ARRAY[]::uuid[], ARRAY[]::uuid[], ARRAY[]::uuid[], NOW()),
('Incomplete Lab Manuals', 'The Chemistry lab manuals handed out have missing pages.', 'Science Block', 'Academics', ARRAY['Academics', 'Resources'], user1, ARRAY[]::uuid[], ARRAY[]::uuid[], ARRAY[]::uuid[], NOW());

-- 2. EVENTS (21 total)
INSERT INTO events (title, description, date, location, registration_link, type, user_id, registrations, created_at)
VALUES
('Student Hub Hackathon 2024', '24-hour sprint to build campus solutions.', NOW() + INTERVAL '7 days', 'Innovation Lab', 'https://hack.studenthub.com', 'Technical', user1, ARRAY[user2, user3], NOW()),
('Annual Cultural Fest: Utsav', 'Vibrant dance, music and food stalls.', NOW() + INTERVAL '14 days', 'Open Air Theatre', 'https://utsav.com', 'Cultural Event', user2, ARRAY[user1], NOW()),
('Blood Donation Drive', 'Help save lives. Certificates provided.', NOW() + INTERVAL '5 days', 'Medical Center', 'https://donate.com', 'Out Reach Activity', user3, ARRAY[user1, user2], NOW()),
('AI & Robotics Workshop', 'Hands-on training with Arduino and Python.', NOW() + INTERVAL '2 days', 'Seminar Hall A', 'https://ai-workshop.com', 'Technical', user1, ARRAY[]::uuid[], NOW()),
('Go Green Rally', 'Awareness walk for a plastic-free campus.', NOW() + INTERVAL '10 days', 'Central Park', 'https://gogreen.com', 'Rally Event', user2, ARRAY[user3], NOW()),
('Mental Health Awareness', 'Experts discussing student stress management.', NOW() + INTERVAL '3 days', 'Auditorium', 'https://wellness.com', 'Awareness Event', user3, ARRAY[]::uuid[], NOW()),
('Code Golf Challenge', 'Shortest code wins! Fun technical event.', NOW() + INTERVAL '1 day', 'CSE Lab 4', 'https://codegolf.com', 'Technical', user1, ARRAY[user2], NOW()),
('Rock Band Competition', 'Battle of the campus bands.', NOW() + INTERVAL '20 days', 'OAT', 'https://rockfest.com', 'Cultural Event', user2, ARRAY[]::uuid[], NOW()),
('Village Outreach Program', 'Teaching basic computer skills to local kids.', NOW() + INTERVAL '30 days', 'Remote Village', 'https://reach.com', 'Out Reach Activity', user3, ARRAY[user1], NOW()),
('Career Guidance Seminar', 'Industry veterans talk about placement prep.', NOW() + INTERVAL '4 days', 'Placement Cell', 'https://career.com', 'Awareness Event', user1, ARRAY[]::uuid[], NOW()),
('Photography Exhibition', 'Displaying student clicks from the trek.', NOW() + INTERVAL '6 days', 'Admin Foyer', 'https://photo.com', 'Cultural Event', user2, ARRAY[user3], NOW()),
('Robo-War Prelims', 'Building combat robots for the main fest.', NOW() + INTERVAL '8 days', 'Mechanical Workshop', 'https://robowar.com', 'Technical', user3, ARRAY[]::uuid[], NOW()),
('Anti-Bullying Seminar', 'Creating a safer environment together.', NOW() + INTERVAL '12 days', 'Classroom 101', 'https://antibully.com', 'Awareness Event', user1, ARRAY[user2], NOW()),
('Startup Pitch Deck', 'Pitch your business idea to real VCs.', NOW() + INTERVAL '15 days', 'Hub', 'https://pitch.com', 'Technical', user2, ARRAY[]::uuid[], NOW()),
('Inter-Collegiate Debate', 'Debating on the ethics of AI.', NOW() + INTERVAL '18 days', 'Moot Court', 'https://debate.com', 'Cultural Event', user3, ARRAY[user1, user2], NOW()),
('Cycling Marathon', 'Promoting zero-emission campus life.', NOW() + INTERVAL '22 days', 'Main Gate', 'https://cycle.com', 'Rally Event', user1, ARRAY[]::uuid[], NOW()),
('Yoga for Students', 'Stress relief session before finals.', NOW() + INTERVAL '25 days', 'Hostel Lawn', 'https://yoga.com', 'Awareness Event', user2, ARRAY[]::uuid[], NOW()),
('UI/UX Design Masterclass', 'Learning Figma and prototyping.', NOW() + INTERVAL '28 days', 'Design Studio', 'https://design.com', 'Technical', user3, ARRAY[]::uuid[], NOW()),
('Stand-up Comedy Night', 'Laugh your exams away.', NOW() + INTERVAL '35 days', 'Canteen Plaza', 'https://laugh.com', 'Cultural Event', user1, ARRAY[user2], NOW()),
('Environmental Cleanup', 'Cleaning the campus lake area.', NOW() + INTERVAL '40 days', 'Campus Lake', 'https://cleanup.com', 'Out Reach Activity', user2, ARRAY[user3], NOW()),
('Intro to Web3 Seminar', 'Understanding Blockchain and Crypto.', NOW() + INTERVAL '45 days', 'Tech Block', 'https://web3.com', 'Technical', user3, ARRAY[]::uuid[], NOW());

-- 3. ANNOUNCEMENTS (20 total)
INSERT INTO announcements (title, content, date, priority, user_id, created_at)
VALUES
('Midterm Exam Schedule', 'Schedule for Sem 3 and Sem 5 released.', NOW(), 'High', user1, NOW()),
('New Library Timings', 'Library open until midnight for final prep.', NOW(), 'Medium', user2, NOW()),
('Scholarship Deadline Extension', 'Last date to apply is now Oct 30.', NOW(), 'High', user3, NOW()),
('Hostel Maintenance Work', 'Water supply cut in Block B on Sunday.', NOW(), 'Medium', user1, NOW()),
('New Canteen Vendor', 'Try the new menu starting Monday!', NOW(), 'Low', user2, NOW()),
('Placement Orientation', 'Mandatory for all 7th sem students.', NOW(), 'High', user3, NOW()),
('Holiday Notice', 'Campus closed for National Day.', NOW(), 'Medium', user1, NOW()),
('Revised Lab Timings', 'CSE lab will be accessible on Saturdays.', NOW(), 'Low', user2, NOW()),
('Guest Lecture by Google Engineer', 'Topic: Scalable Systems.', NOW(), 'Medium', user3, NOW()),
('Found Item: Laptop Bag', 'Collect from Block A security desk.', NOW(), 'Low', user1, NOW()),
('Exam Result Portal Link', 'Results for Sem 2 are live.', NOW(), 'High', user2, NOW()),
('Vaccination Drive', 'Free boosters for all students.', NOW(), 'Medium', user3, NOW()),
('Cultural Committee Meeting', 'Volunteers required for Utsav.', NOW(), 'Low', user1, NOW()),
('Power Cut Schedule', 'Admin block maintenance today.', NOW(), 'Low', user2, NOW()),
('Library Book Return Policy', 'No fines for late returns this week.', NOW(), 'Medium', user3, NOW()),
('New Student Insurance', 'Enroll by this Friday at portal.', NOW(), 'High', user1, NOW()),
('WiFi Password Update', 'Change to Student_2024 active.', NOW(), 'Medium', user2, NOW()),
('Cafeteria Feedback Survey', 'Win vouchers for filling form.', NOW(), 'Low', user3, NOW()),
('Hostel Room Shift Announcement', 'Block A students to move to Block D.', NOW(), 'High', user1, NOW()),
('Yoga Session Cancelled', 'Resource person unavailable.', NOW(), 'Low', user2, NOW());

-- 4. RESOURCES (22 total)
INSERT INTO resources (title, description, url, department, semester, type, tags, user_id, created_at)
VALUES
('OS Complete Notes - Sem 5', 'Handwritten notes on scheduling.', 'https://notes.com/os.pdf', 'CSE', '5th', 'Notes', ARRAY['OS', 'Exam'], user1, NOW()),
('Algorithms Textbook', 'Standard reference for DS & Algo.', 'https://books.com/algo.pdf', 'CSE', '3rd', 'Textbooks', ARRAY['DSA'], user2, NOW()),
('Thermodynamics Problems', 'Practice set for gate prep.', 'https://practice.com/mech.pdf', 'ME', '5th', 'Practice Tests', ARRAY['Mech', 'Gate'], user3, NOW()),
('BT Lab Manual', 'Procedures for molecular biology.', 'https://manual.com/bt.pdf', 'BT', '4th', 'Study Guides', ARRAY['BT', 'Lab'], user1, NOW()),
('Digital Signal Processing', 'Lecture slides by Prof. Sharma.', 'https://slides.com/dsp.pdf', 'ECE', '6th', 'Notes', ARRAY['ECE'], user2, NOW()),
('VLSI Design Guide', 'Summary for quick revision.', 'https://revision.com/vlsi.pdf', 'ECE', '7th', 'Study Guides', ARRAY['ECE', 'VLSI'], user3, NOW()),
('Python for Data Science', 'Full course material with code.', 'https://ds.com/python.pdf', 'AIML', '3rd', 'Textbooks', ARRAY['Python', 'AIML'], user1, NOW()),
('Database Management 101', 'SQL queries and examples.', 'https://sql.com/dbms.pdf', 'ISE', '4th', 'Notes', ARRAY['SQL', 'Database'], user2, NOW()),
('Linear Algebra Practice', 'Solved exercises for semester 1.', 'https://math.com/la.pdf', 'MT', '1st', 'Practice Tests', ARRAY['Math'], user3, NOW()),
('Engineering Drawing Basics', 'CAD tutorials and diagrams.', 'https://cad.com/draw.pdf', 'ME', '1st', 'Notes', ARRAY['ME', 'CAD'], user1, NOW()),
('Circuit Analysis Prep', 'Mock test for mid-term.', 'https://circuit.com/test.pdf', 'EEE', '3rd', 'Practice Tests', ARRAY['EEE', 'Circuit'], user2, NOW()),
('Automata Theory Slides', 'Turing machines explained.', 'https://theory.com/at.pdf', 'CSE', '4th', 'Notes', ARRAY['Theory'], user3, NOW()),
('Embedded Systems Projects', 'Source code for 8051 labs.', 'https://codes.com/embedded.pdf', 'ECE', '5th', 'Study Guides', ARRAY['ECE', 'Micro'], user1, NOW()),
('Heat Transfer Formulas', 'Cheat sheet for final exam.', 'https://cheat.com/heat.pdf', 'ME', '6th', 'Study Guides', ARRAY['Formula'], user2, NOW()),
('Organic Chem Notes', 'Reaction mechanisms for BT.', 'https://chem.com/org.pdf', 'BT', '2nd', 'Notes', ARRAY['Chemistry'], user3, NOW()),
('Computer Networks Guide', 'TCP/IP and OSI stack.', 'https://net.com/osi.pdf', 'ISE', '5th', 'Study Guides', ARRAY['Net'], user1, NOW()),
('Machine Learning Concepts', 'Math foundations for ML.', 'https://ml.com/math.pdf', 'AIML', '5th', 'Textbooks', ARRAY['ML'], user2, NOW()),
('Power Systems Analysis', 'Stability and steady state.', 'https://power.com/ps.pdf', 'EEE', '7th', 'Notes', ARRAY['Power'], user3, NOW()),
('Strength of Materials', 'Building structures theory.', 'https://civil.com/som.pdf', 'MT', '4th', 'Notes', ARRAY['Mech'], user1, NOW()),
('Analog Electronics Lab', 'Transistor bias experiments.', 'https://lab.com/analog.pdf', 'ECE', '3rd', 'Notes', ARRAY['ECE'], user2, NOW()),
('Software Engineering 101', 'SDLC and Agile models.', 'https://se.com/agile.pdf', 'CSE', '6th', 'Notes', ARRAY['SE'], user3, NOW()),
('Java Programming Basics', 'OOP concepts and inheritance.', 'https://java.com/core.pdf', 'ISE', '3rd', 'Textbooks', ARRAY['Java'], user1, NOW());

-- 4. JOBS (20 total)
INSERT INTO jobs (title, company, location, description, salary, currency, application_link, type, deadline, user_id, created_at)
VALUES
('Junior Dev Intern', 'Google', 'Remote', 'Frontend React project.', 50000, 'INR', 'https://google.com/jobs', 'Internship', NOW() + INTERVAL '30 days', user1, NOW()),
('Marketing Executive', 'Nike', 'New York', 'Brand strategy.', 4000, 'USD', 'https://nike.com/jobs', 'Full Time', NOW() + INTERVAL '60 days', user2, NOW()),
('Campus Ambassador', 'RedBull', 'On-Campus', 'Events and marketing.', 200, 'USD', 'https://redbull.com', 'Part Time', NOW() + INTERVAL '15 days', user3, NOW()),
('Data Analyst', 'Meta', 'Bengaluru', 'Python and SQL.', 80000, 'INR', 'https://meta.com', 'Full Time', NOW() + INTERVAL '20 days', user1, NOW()),
('Content Writer', 'Medium', 'Remote', 'Tech articles.', 1500, 'USD', 'https://medium.com', 'Part Time', NOW() + INTERVAL '10 days', user2, NOW()),
('UI Designer', 'Figma', 'London', 'Design components.', 5000, 'GBP', 'https://figma.com/jobs', 'Full Time', NOW() + INTERVAL '45 days', user3, NOW()),
('Backend Intern', 'Amazon', 'Hyderabad', 'Node.js and AWS.', 40000, 'INR', 'https://amazon.com', 'Internship', NOW() + INTERVAL '25 days', user1, NOW()),
('Sales Associate', 'Apple', 'Store', 'In-person sales.', 3000, 'EUR', 'https://apple.com', 'Full Time', NOW() + INTERVAL '35 days', user2, NOW()),
('Research Assistant', 'Stanford', 'Campus', 'ML research.', 2000, 'USD', 'https://stanford.edu', 'Part Time', NOW() + INTERVAL '40 days', user3, NOW()),
('DevOps Engineer', 'Netflix', 'Remote', 'Kubernetes and CICD.', 12000, 'USD', 'https://netflix.com', 'Full Time', NOW() + INTERVAL '50 days', user1, NOW()),
('Product Manager', 'Spotify', 'Stockholm', 'Audio products.', 6000, 'EUR', 'https://spotify.com', 'Full Time', NOW() + INTERVAL '55 days', user2, NOW()),
('Teaching Assistant', 'University', 'Campus', 'Helping Sem 1.', 5000, 'INR', 'https://uni.edu', 'Part Time', NOW() + INTERVAL '18 days', user3, NOW()),
('Graphic Designer', 'Canva', 'Remote', 'Social assets.', 1200, 'USD', 'https://canva.com', 'Part Time', NOW() + INTERVAL '22 days', user1, NOW()),
('SDE 1', 'Microsoft', 'Noida', 'Azure services.', 120000, 'INR', 'https://ms.com', 'Full Time', NOW() + INTERVAL '12 days', user2, NOW()),
('Quality Assurance', 'Uber', 'Remote', 'App testing.', 35000, 'INR', 'https://uber.com', 'Internship', NOW() + INTERVAL '28 days', user3, NOW()),
('HR Coordinator', 'Tesla', 'Berlin', 'Talent hunt.', 5000, 'EUR', 'https://tesla.com', 'Full Time', NOW() + INTERVAL '65 days', user1, NOW()),
('Mobile Developer', 'Snapchat', 'LA', 'Android/iOS snap.', 9000, 'USD', 'https://snap.com', 'Full Time', NOW() + INTERVAL '70 days', user2, NOW()),
('Financial Analyst', 'Goldman', 'Mumbai', 'Reports and risk.', 100000, 'INR', 'https://gs.com', 'Full Time', NOW() + INTERVAL '14 days', user3, NOW()),
('Community Manager', 'Discord', 'Remote', 'Server moderation.', 2500, 'USD', 'Part Time', 'Part Time', NOW() + INTERVAL '10 days', user1, NOW()),
('Video Editor', 'YouTube', 'Remote', 'Ad campaigns.', 3000, 'USD', 'Full Time', 'Full Time', NOW() + INTERVAL '42 days', user2, NOW());

-- 6. STUDY GROUPS (20 total)
INSERT INTO study_groups (name, description, subject, day, location, whatsapp_link, members, user_id, created_at)
VALUES
('Algo Mastery Circle', 'Solving DP and Graphs.', 'Computer Science', 'Tuesday', 'Room 204', 'https://wa.me/1', ARRAY[user1, user2], user1, NOW()),
('BT Prep Sem 3', 'Biochem focused group.', 'Bio Technology', 'Friday', 'Library Lounge', 'https://wa.me/2', ARRAY[user2], user2, NOW()),
('Circuit Wizards', 'Analog and Digital circuit solving.', 'Electronics', 'Monday', 'Lab 1', 'https://wa.me/3', ARRAY[user1, user3], user3, NOW()),
('Mechanical Heavies', 'Thermodynamics revision.', 'Mechanical', 'Thursday', 'Workshop', 'https://wa.me/4', ARRAY[user2, user3], user2, NOW()),
('Civil Surveyors', 'Site mapping and CAD help.', 'Civil', 'Wednesday', 'Field', 'https://wa.me/5', ARRAY[user3, user1], user1, NOW()),
('Pythonistas', 'ML algorithms from scratch.', 'Computer Science', 'Saturday', 'Online', 'https://wa.me/6', ARRAY[user1, user2, user3], user2, NOW()),
('Mechatronics Mix', 'Control systems help.', 'Mechanotronics', 'Tuesday', 'Room 305', 'https://wa.me/7', ARRAY[user1], user3, NOW()),
('Bio-Tech Research', 'Journal review group.', 'Bio Technology', 'Monday', 'Cafe', 'https://wa.me/8', ARRAY[user2, user3], user1, NOW()),
('SDE Interview Prep', 'LeetCode together.', 'Computer Science', 'Sunday', 'Discord', 'https://wa.me/9', ARRAY[user3], user2, NOW()),
('VLSI Designs', 'Verilog coding help.', 'Electronics', 'Friday', 'Block A', 'https://wa.me/10', ARRAY[user1], user3, NOW()),
('Solid Works Fans', 'Mechanical CAD tutorials.', 'Mechanical', 'Wednesday', 'Room 401', 'https://wa.me/11', ARRAY[user2], user1, NOW()),
('Surveying 101', 'Field work practice.', 'Civil', 'Thursday', 'Grounds', 'https://wa.me/12', ARRAY[user3], user2, NOW()),
('Robotics Project', 'Building a line follower.', 'Mechanotronics', 'Tuesday', 'Workshop', 'https://wa.me/13', ARRAY[user1], user3, NOW()),
('Genetics Study', 'Sem 4 DNA sequencing.', 'Bio Technology', 'Friday', 'Lab 2', 'https://wa.me/14', ARRAY[user2], user1, NOW()),
('Frontend Masters', 'React and Tailwind.', 'Computer Science', 'Monday', 'Common Room', 'https://wa.me/15', ARRAY[user3], user2, NOW()),
('Power Systems', 'EE students circle.', 'Electronics', 'Thursday', 'Room 202', 'https://wa.me/16', ARRAY[user1], user3, NOW()),
('Engine Designs', 'Combustion theory.', 'Mechanical', 'Wednesday', 'Workshop', 'https://wa.me/17', ARRAY[user2], user1, NOW()),
('Material Science', 'Civil lab prep.', 'Civil', 'Saturday', 'Library', 'https://wa.me/18', ARRAY[user3], user2, NOW()),
('Control Theory', 'Mechatronics Sem 6.', 'Mechanotronics', 'Tuesday', 'Block C', 'https://wa.me/19', ARRAY[user1], user3, NOW()),
('Network Security', 'Ethical hacking prep.', 'Computer Science', 'Friday', 'IT Block', 'https://wa.me/20', ARRAY[user2], user1, NOW());

-- 7. SCHOLARSHIPS (20 total)
INSERT INTO scholarships (title, description, eligibility, deadline, category, tags, provider, application_link, user_id, reports, created_at)
VALUES
('National Merit 2024', 'Award for top 1% students.', '90% above.', NOW() + INTERVAL '45 days', 'National Level', ARRAY['Merit'], 'Govt', 'https://nm.gov', user1, ARRAY[]::uuid[], NOW()),
('Women in Tech', 'Empowering female engineers.', 'Female in STEM.', NOW() + INTERVAL '20 days', 'Female', ARRAY['Women'], 'Future', 'https://wit.com', user2, ARRAY[]::uuid[], NOW()),
('State Excellence', 'For local residents.', 'State address.', NOW() + INTERVAL '15 days', 'State Level', ARRAY['State'], 'Local', 'https://state.com', user3, ARRAY[]::uuid[], NOW()),
('Leaders of Tomorrow', 'Leadership scholarship.', 'Club head.', NOW() + INTERVAL '30 days', 'National Level', ARRAY['Leader'], 'NGO', 'https://lead.com', user1, ARRAY[]::uuid[], NOW()),
('GHC Scholarship', 'Grant for Grace Hopper.', 'Female student.', NOW() + INTERVAL '10 days', 'Female', ARRAY['GHC'], 'AnitaB', 'https://ghc.com', user2, ARRAY[]::uuid[], NOW()),
('Sports Star Award', 'For athletes.', 'State level play.', NOW() + INTERVAL '50 days', 'National Level', ARRAY['Sports'], 'SAI', 'https://sports.com', user3, ARRAY[]::uuid[], NOW()),
('Rural Connect', 'For students from villages.', 'Rural resident.', NOW() + INTERVAL '25 days', 'State Level', ARRAY['Rural'], 'Trust', 'https://rural.com', user1, ARRAY[]::uuid[], NOW()),
('Merit-cum-Means', 'Income based support.', 'Income < 2L.', NOW() + INTERVAL '35 days', 'National Level', ARRAY['Means'], 'Charity', 'https://means.com', user2, ARRAY[]::uuid[], NOW()),
('Men in Nursing', 'Encouraging diversity.', 'Male student.', NOW() + INTERVAL '40 days', 'Male', ARRAY['Nurse'], 'Health', 'https://nurse.com', user3, ARRAY[]::uuid[], NOW()),
('Innovation Grant', 'For best startup idea.', 'Pitch submission.', NOW() + INTERVAL '60 days', 'National Level', ARRAY['Idea'], 'Corp', 'https://idea.com', user1, ARRAY[]::uuid[], NOW()),
('E-Sports Grant', 'For top gamers.', 'Tournament win.', NOW() + INTERVAL '18 days', 'National Level', ARRAY['Gaming'], 'Razer', 'https://game.com', user2, ARRAY[]::uuid[], NOW()),
('Arts & Culture', 'For performers.', 'Portfolio.', NOW() + INTERVAL '22 days', 'National Level', ARRAY['Art'], 'Foundation', 'https://art.com', user3, ARRAY[]::uuid[], NOW()),
('Disabled Student Support', 'Inclusive funding.', 'Disability cert.', NOW() + INTERVAL '28 days', 'National Level', ARRAY['Inclusive'], 'Govt', 'https://pwd.com', user1, ARRAY[]::uuid[], NOW()),
('STEM Excellence', 'For math toppers.', 'A+ in Math.', NOW() + INTERVAL '14 days', 'National Level', ARRAY['STEM'], 'Maths', 'https://stem.com', user2, ARRAY[]::uuid[], NOW()),
('Coding Diva', 'Women coding contest.', 'Female in CSE.', NOW() + INTERVAL '10 days', 'Female', ARRAY['Code'], 'Adobe', 'https://diva.com', user3, ARRAY[]::uuid[], NOW()),
('Eco-Warrior Grant', 'For env activists.', 'Project report.', NOW() + INTERVAL '55 days', 'State Level', ARRAY['Eco'], 'Green', 'https://eco.com', user1, ARRAY[]::uuid[], NOW()),
('Alumni Legacy', 'Children of alumni.', 'Parent alum.', NOW() + INTERVAL '65 days', 'National Level', ARRAY['Legacy'], 'Uni', 'https://alum.com', user2, ARRAY[]::uuid[], NOW()),
('SDE Prep Fund', 'For online courses.', 'Poor students.', NOW() + INTERVAL '12 days', 'National Level', ARRAY['Courses'], 'EdTech', 'https://courses.com', user3, ARRAY[]::uuid[], NOW()),
('Hackathon Winner', 'Additional grant.', 'Winner cert.', NOW() + INTERVAL '42 days', 'National Level', ARRAY['Hack'], 'Sponsor', 'https://win.com', user1, ARRAY[]::uuid[], NOW()),
('Diversity Fellowship', 'For underrepresented.', 'Background.', NOW() + INTERVAL '70 days', 'National Level', ARRAY['Diversity'], 'Global', 'https://div.com', user2, ARRAY[]::uuid[], NOW());

END $$;
