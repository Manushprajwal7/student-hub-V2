-- Student Hub Extended Seed Data
-- Instructions: Copy and paste this into your Supabase SQL Editor and run it.
-- This adds an ADDITIONAL 20+ entries to each table (140+ new rows).

DO $$
DECLARE
    user1 UUID := 'a61ab2d4-8b0c-42dc-9126-ecb71308024e';
    user2 UUID := '26e040fe-e652-4cc1-b687-636ad4e2fc29';
    user3 UUID := 'dba2643a-f252-41e6-afcb-0e077ee35310';
BEGIN

-- 1. ISSUES (20 more)
INSERT INTO issues (title, description, location, category, tags, user_id, upvotes, downvotes, reports, created_at)
VALUES 
('Broken Bench in Block A Lobby', 'The main wooden bench in the Block A entrance lobby is cracked and dangerous.', 'Block A Lobby', 'Infrastructure', ARRAY['Maintenance', 'Furniture'], user1, ARRAY[]::uuid[], ARRAY[]::uuid[], ARRAY[]::uuid[], NOW()),
('Software License Expired in Lab 3', 'The MATLAB licenses in Lab 3 have expired, preventing us from finishing our DSP assignments.', 'Block B, Lab 3', 'Academics', ARRAY['Software', 'Academics'], user2, ARRAY[user1], ARRAY[]::uuid[], ARRAY[]::uuid[], NOW()),
('Inadequate Water Pressure', 'Water pressure in the 2nd-floor washrooms is nearly zero during peak hours.', 'Block C, 2nd Floor', 'Infrastructure', ARRAY['Water', 'Maintenance'], user3, ARRAY[]::uuid[], ARRAY[]::uuid[], ARRAY[]::uuid[], NOW()),
('Stray Cat Overpopulation', 'Large number of stray cats entering the canteen area, causing hygiene concerns.', 'Main Canteen', 'Campus', ARRAY['Hygiene', 'Campus'], user1, ARRAY[user2], ARRAY[]::uuid[], ARRAY[]::uuid[], NOW()),
('No First-Aid Kit in Gym', 'The student gym lacks a basic first-aid kit for minor injuries during workouts.', 'Campus Gym', 'Sports', ARRAY['Safety', 'Health'], user2, ARRAY[user3], ARRAY[]::uuid[], ARRAY[]::uuid[], NOW()),
('Projector Blurry in Room 402', 'The projector lens in Room 402 is dirty or damaged, making lectures unreadable.', 'Block D, Room 402', 'Teaching', ARRAY['Classroom', 'Tech'], user3, ARRAY[]::uuid[], ARRAY[]::uuid[], ARRAY[]::uuid[], NOW()),
('Lack of Dustbins Near Sports Field', 'Littering is increasing near the basketball courts due to no bins.', 'Sports Field', 'Infrastructure', ARRAY['Cleanliness', 'Sports'], user1, ARRAY[]::uuid[], ARRAY[]::uuid[], ARRAY[]::uuid[], NOW()),
('Unprofessional Conduct by Security', 'Security guard at the East Gate was rude and dismissive to female students.', 'East Gate', 'Campus', ARRAY['Security', 'Policy'], user2, ARRAY[user1, user3], ARRAY[]::uuid[], ARRAY[]::uuid[], NOW()),
('Old Editions in Library', 'The "Design Patterns" section only has the 1994 edition. Need newer versions.', 'Library, 2nd Floor', 'Academics', ARRAY['Library', 'Academics'], user3, ARRAY[]::uuid[], ARRAY[]::uuid[], ARRAY[]::uuid[], NOW()),
('Canteen Overcharging for Water', 'Bottled water is being sold above MRP in the satellite canteen.', 'Satellite Canteen', 'Student Services', ARRAY['Consumer', 'Policy'], user1, ARRAY[user2], ARRAY[]::uuid[], ARRAY[]::uuid[], NOW()),
('Bad Ventilation in Music Room', 'The soundproof music room is extremely stuffy and needs an exhaust fan.', 'Student Center', 'Extracurricular Activities', ARRAY['Music', 'Facilities'], user2, ARRAY[]::uuid[], ARRAY[]::uuid[], ARRAY[]::uuid[], NOW()),
('Broken Handrail on Stairs', 'The metal handrail on the stairs leading to the terrace is loose.', 'Block E, Stairs', 'Infrastructure', ARRAY['Safety', 'Maintenance'], user3, ARRAY[]::uuid[], ARRAY[]::uuid[], ARRAY[]::uuid[], NOW()),
('Slow Internet in Semester 1 Block', 'The Wi-Fi speeds in the first-year block are below 1Mbps.', 'Block G', 'Infrastructure', ARRAY['WiFi', 'Internet'], user1, ARRAY[user3], ARRAY[]::uuid[], ARRAY[]::uuid[], NOW()),
('Ragging Incident: Verbal Abuse', 'Heard seniors using abusive language toward juniors near the gate.', 'South Gate', 'Ragging', ARRAY['Policy', 'Safety'], user2, ARRAY[]::uuid[], ARRAY[]::uuid[], ARRAY[]::uuid[], NOW()),
('Inadequate Lighting in Library Annex', 'The reading desks in the back rows are too dark for evening study.', 'Library Annex', 'Infrastructure', ARRAY['Lighting', 'Study'], user3, ARRAY[user1], ARRAY[]::uuid[], ARRAY[]::uuid[], NOW()),
('Sports Equip. Check-out Delay', 'The sports office is often closed during its posted working hours.', 'Physical Education Dept', 'Sports', ARRAY['Sports', 'Service'], user1, ARRAY[]::uuid[], ARRAY[]::uuid[], ARRAY[]::uuid[], NOW()),
('Clogged Drain Near Block B', 'Rainwater is pooling and creating a mosquito breeding ground.', 'Outside Block B', 'Infrastructure', ARRAY['Environment', 'Maintenance'], user2, ARRAY[user3], ARRAY[]::uuid[], ARRAY[]::uuid[], NOW()),
('Inaccurate Attendance in Portal', 'The biometric system missed several entries for the CSE A section.', 'Digital Portal', 'Academics', ARRAY['Attendance', 'Tech'], user3, ARRAY[]::uuid[], ARRAY[]::uuid[], ARRAY[]::uuid[], NOW()),
('Leaking Ceiling in Canteen', 'Water drips on tables during heavy rain in the east wing of the canteen.', 'Main Canteen', 'Infrastructure', ARRAY['Maintenance', 'Facilities'], user1, ARRAY[]::uuid[], ARRAY[]::uuid[], ARRAY[]::uuid[], NOW()),
('Lack of Privacy Screens in Clinic', 'The student clinic needs better partitions between patient beds.', 'University Health Center', 'Student Services', ARRAY['Health', 'Privacy'], user2, ARRAY[]::uuid[], ARRAY[]::uuid[], ARRAY[]::uuid[], NOW());

-- 2. EVENTS (20 more)
INSERT INTO events (title, description, date, location, registration_link, type, user_id, registrations, created_at)
VALUES
('Cloud Computing Summit', 'Full day event with speakers from AWS and Azure.', NOW() + INTERVAL '25 days', 'Tech Hall', 'https://cloud.studenthub.com', 'Technical', user1, ARRAY[user2], NOW()),
('Poetry Slam Night', 'Express your soul through words. Open to all.', NOW() + INTERVAL '12 days', 'Cafeteria Lounge', 'https://poetry.com', 'Cultural Event', user2, ARRAY[user1, user3], NOW()),
('Mental Health Awareness Walk', 'Join us for a morning stroll to support wellness.', NOW() + INTERVAL '8 days', 'Main Park', 'https://wellnesswalk.com', 'Awareness Event', user3, ARRAY[]::uuid[], NOW()),
('Clean Campus Drive', 'Spending a Saturday cleaning the campus lake.', NOW() + INTERVAL '6 days', 'Campus Lake', 'https://clean.com', 'Out Reach Activity', user1, ARRAY[user2], NOW()),
('Marathon for Education', 'Running to raise funds for local school kits.', NOW() + INTERVAL '30 days', 'Stadium', 'https://run.com', 'Rally Event', user2, ARRAY[]::uuid[], NOW()),
('Node.js Backend Masterclass', 'Building scalable APIs from scratch.', NOW() + INTERVAL '3 days', 'CSE Lab 2', 'https://nodejs.com', 'Technical', user3, ARRAY[user1], NOW()),
('Traditional Dress Day', 'Celebrate our diversity through fashion.', NOW() + INTERVAL '15 days', 'Central Plaza', 'https://fest.com', 'Cultural Event', user1, ARRAY[]::uuid[], NOW()),
('Financial Literacy for Students', 'Learning how to invest and save early.', NOW() + INTERVAL '18 days', 'Seminar Hall B', 'https://finance.com', 'Awareness Event', user2, ARRAY[user3], NOW()),
('Alumni Networking Gala', 'Connect with seniors working at top firms.', NOW() + INTERVAL '22 days', 'University Ballroom', 'https://alumni.com', 'Cultural Event', user3, ARRAY[user1, user2], NOW()),
('Robo-Race Finals', 'The ultimate race between student-built bots.', NOW() + INTERVAL '5 days', 'Mechanical Bay', 'https://roborace.com', 'Technical', user1, ARRAY[]::uuid[], NOW()),
('Inter-Hostel Cricket Match', 'Finals: Red vs Blue house.', NOW() + INTERVAL '4 days', 'Cricket Ground', 'https://cricket.com', 'Cultural Event', user2, ARRAY[user1], NOW()),
('Anti-Drug Rally', 'Say no to drugs, yes to life.', NOW() + INTERVAL '28 days', 'City Square', 'https://rally.com', 'Rally Event', user3, ARRAY[]::uuid[], NOW()),
('UX Research Workshop', 'User testing and interview methodologies.', NOW() + INTERVAL '40 days', 'Design Lab', 'https://ux.com', 'Technical', user1, ARRAY[]::uuid[], NOW()),
('Starlit Movie Night', 'Watching Cinema Paradiso under the stars.', NOW() + INTERVAL '10 days', 'OAT', 'https://movienight.com', 'Cultural Event', user2, ARRAY[user3], NOW()),
('Teaching Skills Seminar', 'For PhD students and aspiring educators.', NOW() + INTERVAL '35 days', 'Academic Block', 'https://teach.com', 'Awareness Event', user3, ARRAY[]::uuid[], NOW()),
('Coding for Charity', 'Developing websites for local small NGOs.', NOW() + INTERVAL '45 days', 'Hub', 'https://code4good.com', 'Out Reach Activity', user1, ARRAY[user2], NOW()),
('Yoga for Exam Stress', 'Gentle flow to calm your mind.', NOW() + INTERVAL '2 days', 'Hostel Courtyard', 'https://yoga.com', 'Awareness Event', user2, ARRAY[]::uuid[], NOW()),
('Chess Championship', 'Finding the campus grandmaster.', NOW() + INTERVAL '14 days', 'Student Lounge', 'https://chess.com', 'Technical', user3, ARRAY[user1], NOW()),
('Karaoke Night', 'Sing your heart out, no judgment.', NOW() + INTERVAL '7 days', 'Music Room', 'https://karaoke.com', 'Cultural Event', user1, ARRAY[]::uuid[], NOW()),
('Sustainable Living Talk', 'How to reduce your campus footprint.', NOW() + INTERVAL '16 days', 'Auditorium', 'https://eco.com', 'Awareness Event', user2, ARRAY[user3], NOW());

-- 3. ANNOUNCEMENTS (20 more)
INSERT INTO announcements (title, content, date, priority, user_id, created_at)
VALUES
('Revised Canteen Hours', 'Canteen will now stay open until 10 PM on weekdays.', NOW(), 'Low', user1, NOW()),
('Internal Assessment Schedule', 'IA-2 for all departments starts next week.', NOW(), 'High', user2, NOW()),
('Volunteers for Convocation', 'Apply at the admin office to help with graduation.', NOW(), 'Medium', user3, NOW()),
('Digital Library Access Fix', 'Access issues with IEEE Xplore have been resolved.', NOW(), 'Medium', user1, NOW()),
('New Bus Route: North Campus', 'Shuttle now covers the north parking lot.', NOW(), 'Low', user2, NOW()),
('Campus Placement Drive: Microsoft', 'Open to all final year CS and IT students.', NOW(), 'High', user3, NOW()),
('Maintenance: Water Filter Block A', 'Will be out of service for 3 hours today.', NOW(), 'Low', user1, NOW()),
('Guest Lecture: Data Privacy', 'Expert from Privacy Commission speaking tomorrow.', NOW(), 'Medium', user2, NOW()),
('Student Election Nominations', 'Forms available at the student council office.', NOW(), 'High', user3, NOW()),
('Lost Property: Sony Headphones', 'If found, return to Library front desk.', NOW(), 'Low', user1, NOW()),
('Semester Fee Payment Deadline', 'Last date without fine is tomorrow.', NOW(), 'High', user2, NOW()),
('Hostel Mess Menu Change', 'Revised breakfast menu for the summer semester.', NOW(), 'Medium', user3, NOW()),
('Found Property: Room Keys', 'Found near the fountain. Identify and collect.', NOW(), 'Low', user1, NOW()),
('Psychological Counseling Desk', 'Free consultation available every Thursday.', NOW(), 'Medium', user2, NOW()),
('Annual Sports Day Registration', 'Sign up for individual and team events now.', NOW(), 'Medium', user3, NOW()),
('Campus Security Advisory', 'Be cautious while using the back gate after 9 PM.', NOW(), 'High', user1, NOW()),
('Project Proposal Deadline', 'For final year projects, submit on portal by Friday.', NOW(), 'High', user2, NOW()),
('New Vending Machine Installed', 'Located in the Block B 2nd floor lounge.', NOW(), 'Low', user3, NOW()),
('WiFi Maintenance Tonight', 'Service will be down from 2 AM to 4 AM.', NOW(), 'Medium', user1, NOW()),
('Academic Achievement Ceremony', 'Topper awards for last semester on Saturday.', NOW(), 'Medium', user2, NOW());

-- 4. RESOURCES (20 more)
INSERT INTO resources (title, description, url, department, semester, type, tags, user_id, created_at)
VALUES
('Database Systems: Notes', 'Covering Normalization and Indexing.', 'https://notes.com/db.pdf', 'CSE', '5th', 'Notes', ARRAY['DBMS', 'SQL'], user1, NOW()),
('Electronic Devices Textbook', 'Standard reference for semiconductors.', 'https://books.com/ed.pdf', 'ECE', '3rd', 'Textbooks', ARRAY['ECE', 'Physics'], user2, NOW()),
('Manufacturing Process Mock', 'Practice questions for upcoming exams.', 'https://test.com/mfg.pdf', 'ME', '4th', 'Practice Tests', ARRAY['ME', 'Gate'], user3, NOW()),
('Genetics Lab Guide', 'Step-by-step for CRISPR experiments.', 'https://lab.com/genes.pdf', 'BT', '5th', 'Study Guides', ARRAY['BT', 'Bio'], user1, NOW()),
('Control Systems Lecture', 'Slides on root locus and stability.', 'https://slides.com/ctrl.pdf', 'EEE', '6th', 'Notes', ARRAY['EEE', 'Math'], user2, NOW()),
('Data Mining Final Review', 'Consolidated notes for final revision.', 'https://dm.com/review.pdf', 'CSE', '7th', 'Study Guides', ARRAY['DM', 'AI'], user3, NOW()),
('Natural Language Proc Book', 'Comprehensive guide to Transformers.', 'https://ai.com/nlp.pdf', 'AIML', '6th', 'Textbooks', ARRAY['NLP', 'AI'], user1, NOW()),
('Software Testing Notes', 'SDLC and manual testing basics.', 'https://test.com/se.pdf', 'ISE', '5th', 'Notes', ARRAY['Testing', 'ISE'], user2, NOW()),
('Calculus Formulas', 'Essential integration and derivatives.', 'https://math.com/calc.pdf', 'MT', '2nd', 'Study Guides', ARRAY['Math'], user3, NOW()),
('Structural Design Intro', 'Loads and forces for buildings.', 'https://civil.com/sd.pdf', 'ME', '3rd', 'Notes', ARRAY['Civil', 'ME'], user1, NOW()),
('Communication Systems Prep', 'Previous year solved papers.', 'https://comm.com/test.pdf', 'ECE', '5th', 'Practice Tests', ARRAY['ECE'], user2, NOW()),
('Graph Theory Slides', 'For discrete mathematics students.', 'https://graph.com/math.pdf', 'CSE', '3rd', 'Notes', ARRAY['Math', 'CSE'], user3, NOW()),
('Microcontroller Manual', 'Instructions for ARM Cortex-M4.', 'https://arm.com/manual.pdf', 'ECE', '6th', 'Study Guides', ARRAY['ECE', 'Embedded'], user1, NOW()),
('Fluid Mechanics Summary', 'Cheat sheet on Bernoulli and piping.', 'https://mech.com/fluid.pdf', 'ME', '4th', 'Study Guides', ARRAY['Mech'], user2, NOW()),
('Molecular Biology Slides', 'Cell cycle and replication.', 'https://bio.com/mol.pdf', 'BT', '3rd', 'Notes', ARRAY['BT', 'Cell'], user3, NOW()),
('IoT Architecture Guide', 'Sensors and cloud connectivity.', 'https://iot.com/guide.pdf', 'ISE', '6th', 'Study Guides', ARRAY['IoT'], user1, NOW()),
('Deep Learning Textbook', 'Math for neural networks.', 'https://dl.com/book.pdf', 'AIML', '7th', 'Textbooks', ARRAY['DL', 'AI'], user2, NOW()),
('Power Electronics Lab', 'Inverter and chopper circuits.', 'https://eee.com/lab.pdf', 'EEE', '5th', 'Notes', ARRAY['EEE'], user3, NOW()),
('Surveying Notes', 'Total station and GPS basics.', 'https://survey.com/notes.pdf', 'MT', '3rd', 'Notes', ARRAY['Civil'], user1, NOW()),
('Compiler Design Guide', 'Flex and Bison tutorials.', 'https://compiler.com/guide.pdf', 'CSE', '6th', 'Study Guides', ARRAY['CSE', 'PL'], user2, NOW());

-- 5. JOBS (20 more)
INSERT INTO jobs (title, company, location, description, salary, currency, application_link, type, deadline, user_id, created_at)
VALUES
('SDE Intern (Fall)', 'Uber', 'Bengaluru / Remote', 'Work on logistics routing systems.', 45000, 'INR', 'https://uber.com/jobs', 'Internship', NOW() + INTERVAL '40 days', user1, NOW()),
('Social Media Manager', 'Spotify', 'London', 'Manage artist campaigns.', 3500, 'GBP', 'https://spotify.com/careers', 'Full Time', NOW() + INTERVAL '50 days', user2, NOW()),
('Events Assistant', 'Mastercard', 'Campus / Pune', 'Organize campus recruitment drives.', 150, 'USD', 'https://mastercard.com', 'Part Time', NOW() + INTERVAL '12 days', user3, NOW()),
('Machine Learning Dev', 'NVIDIA', 'Hyderabad', 'Optimizing CUDA kernels.', 150000, 'INR', 'https://nvidia.com', 'Full Time', NOW() + INTERVAL '25 days', user1, NOW()),
('Technical Writer', 'Atlassian', 'Remote', 'Documenting API endpoints.', 2000, 'USD', 'https://atlassian.com', 'Part Time', NOW() + INTERVAL '18 days', user2, NOW()),
('Lead UX Designer', 'Airbnb', 'Remote / US', 'Polishing the travel experience.', 80000, 'USD', 'https://airbnb.com/jobs', 'Full Time', NOW() + INTERVAL '55 days', user3, NOW()),
('Full Stack Intern', 'Zomato', 'Gurugram', 'Building vendor dashboards.', 30000, 'INR', 'https://zomato.com', 'Internship', NOW() + INTERVAL '30 days', user1, NOW()),
('Customer Success', 'Salesforce', 'Dublin', 'Helping enterprise clients.', 4500, 'EUR', 'https://sf.com', 'Full Time', NOW() + INTERVAL '60 days', user2, NOW()),
('Stats Tutor', 'Chegg', 'Online', 'Solving probability problems.', 300, 'USD', 'https://chegg.com', 'Part Time', NOW() + INTERVAL '20 days', user3, NOW()),
('Site Reliability Eng', 'Google', 'Munich', 'Keeping search running.', 10000, 'EUR', 'https://google.com/sre', 'Full Time', NOW() + INTERVAL '65 days', user1, NOW()),
('Business Analyst', 'Deloitte', 'New York', 'Data-driven consulting.', 7000, 'USD', 'https://deloitte.com', 'Full Time', NOW() + INTERVAL '70 days', user2, NOW()),
('Peer Mentor', 'University', 'On-Campus', 'Advising first-years.', 2500, 'INR', 'https://uni.edu/jobs', 'Part Time', NOW() + INTERVAL '15 days', user3, NOW()),
('Identity Designer', 'Pentagram', 'London / Remote', 'Logos and branding.', 2500, 'GBP', 'https://pentagram.com', 'Part Time', NOW() + INTERVAL '28 days', user1, NOW()),
('Security Engineer', 'CrowdStrike', 'Remote', 'Stopping cyber threats.', 15000, 'USD', 'https://crowdstrike.com', 'Full Time', NOW() + INTERVAL '45 days', user2, NOW()),
('Database Admin Intern', 'Oracle', 'Mumbai', 'Managing large scale DBs.', 35000, 'INR', 'https://oracle.com', 'Internship', NOW() + INTERVAL '35 days', user3, NOW()),
('Project Coord.', 'SpaceX', 'Brownsville', 'Tracking launch parts.', 6000, 'USD', 'https://spacex.com', 'Full Time', NOW() + INTERVAL '80 days', user1, NOW()),
('iOS Dev (Contract)', 'Duolingo', 'Remote', 'Language learning app.', 5000, 'USD', 'https://duo.com', 'Full Time', NOW() + INTERVAL '32 days', user2, NOW()),
('Investment Analyst', 'J.P. Morgan', 'Hong Kong', 'Equity market research.', 12000, 'USD', 'https://jpm.com', 'Full Time', NOW() + INTERVAL '12 days', user3, NOW()),
('Discord Moderator', 'GameStudio', 'Remote', 'Community engagement.', 1200, 'USD', 'Part Time', 'Part Time', NOW() + INTERVAL '9 days', user1, NOW()),
('Junior Editor', 'Vogue', 'Remote', 'Proofreading fashion blogs.', 2000, 'USD', 'Part Time', 'Part Time', NOW() + INTERVAL '42 days', user2, NOW());

-- 6. STUDY GROUPS (20 more)
INSERT INTO study_groups (name, description, subject, day, location, whatsapp_link, members, user_id, created_at)
VALUES
('Discrete Math Group', 'Logic and set theory problems.', 'Computer Science', 'Wednesday', 'Room 102', 'https://wa.me/a', ARRAY[user1, user3], user1, NOW()),
('Bio-Chemical Bonds', 'Preparing for the lab quiz.', 'Bio Technology', 'Monday', 'Lab Lounge', 'https://wa.me/b', ARRAY[user2], user2, NOW()),
('Analog Wizards', 'Understanding BJT amplifiers.', 'Electronics', 'Friday', 'Block A, 1st Floor', 'https://wa.me/c', ARRAY[user1, user2], user3, NOW()),
('Mech Designing Hub', 'AutoCAD and SolidWorks help.', 'Mechanical', 'Thursday', 'Computer Center', 'https://wa.me/d', ARRAY[user2, user3], user2, NOW()),
('Construction Circle', 'Strength of materials prep.', 'Civil', 'Saturday', 'Field Office', 'https://wa.me/e', ARRAY[user3], user1, NOW()),
('Java Beginners', 'OOP fundamentals together.', 'Computer Science', 'Monday', 'Cafe 2', 'https://wa.me/f', ARRAY[user1, user2], user2, NOW()),
('Robotics Project B', 'Building a robotic arm.', 'Mechanotronics', 'Tuesday', 'Bay 4', 'https://wa.me/g', ARRAY[user1], user3, NOW()),
('Microbiology Fans', 'Cell culture and observation.', 'Bio Technology', 'Wednesday', 'Science Block', 'https://wa.me/h', ARRAY[user2, user3], user1, NOW()),
('LeetCode 100 Day', 'Consistency challenge group.', 'Computer Science', 'Everyday', 'Discord', 'https://wa.me/i', ARRAY[user3], user2, NOW()),
('IC Engine Gurus', 'Thermodynamics of engines.', 'Mechanical', 'Saturday', 'Lab 1', 'https://wa.me/j', ARRAY[user1], user3, NOW()),
('3D Printing Club', 'FDM and Resin print help.', 'Mechanical', 'Wednesday', 'Room 501', 'https://wa.me/k', ARRAY[user2], user1, NOW()),
('Highway Eng Circle', 'Asphalt and routing theory.', 'Civil', 'Thursday', 'Library', 'https://wa.me/l', ARRAY[user3], user2, NOW()),
('Drone Dev Group', 'Flight controllers and GPS.', 'Mechanotronics', 'Tuesday', 'Open Ground', 'https://wa.me/m', ARRAY[user1], user3, NOW()),
('BT Exam Prep', 'Solving sem 4 papers.', 'Bio Technology', 'Friday', 'Room 203', 'https://wa.me/n', ARRAY[user2], user1, NOW()),
('Vue.js Study Cabal', 'Learning composition API.', 'Computer Science', 'Monday', 'Classroom 3', 'https://wa.me/o', ARRAY[user3], user2, NOW()),
('Power Electronics EE', 'Rectifiers and inverters.', 'Electronics', 'Thursday', 'Room 205', 'https://wa.me/p', ARRAY[user1], user3, NOW()),
('Machine Design Hub', 'Gears and bearings theory.', 'Mechanical', 'Wednesday', 'Bay 2', 'https://wa.me/q', ARRAY[user2], user1, NOW()),
('Civil Drafting Unit', 'Civil 3D software help.', 'Civil', 'Saturday', 'Lab B', 'https://wa.me/r', ARRAY[user3], user2, NOW()),
('Control Labs Help', 'Matlab/Simulink support.', 'Mechanotronics', 'Tuesday', 'Room 401', 'https://wa.me/s', ARRAY[user1], user3, NOW()),
('Cyber Sec Beginners', 'Linux basics for hacking.', 'Computer Science', 'Friday', 'Block C', 'https://wa.me/t', ARRAY[user2], user1, NOW());

-- 7. SCHOLARSHIPS (20 more)
INSERT INTO scholarships (title, description, eligibility, deadline, category, tags, provider, application_link, user_id, reports, created_at)
VALUES
('Global Scholar 2025', 'For international students.', 'Non-citizen student.', NOW() + INTERVAL '50 days', 'National Level', ARRAY['Global'], 'World Uni', 'https://gs.com', user1, ARRAY[]::uuid[], NOW()),
('Adobe Women in Tech', 'Grant for female coders.', 'Female CS student.', NOW() + INTERVAL '15 days', 'Female', ARRAY['Adobe', 'Tech'], 'Adobe', 'https://adobe.com', user2, ARRAY[]::uuid[], NOW()),
('State Sports Grant', 'Monthly stipend for athletes.', 'State level player.', NOW() + INTERVAL '12 days', 'State Level', ARRAY['Sports'], 'State Sports Bureau', 'https://statespx.com', user3, ARRAY[]::uuid[], NOW()),
('Ethics in AI Grant', 'Research funding for seniors.', 'PhD or Final Year.', NOW() + INTERVAL '40 days', 'National Level', ARRAY['Ethics', 'AI'], 'Mindful Foundation', 'https://ethics.com', user1, ARRAY[]::uuid[], NOW()),
('Grace Hopper Travel', 'Full funding for GHC 2024.', 'Female under-grad.', NOW() + INTERVAL '10 days', 'Female', ARRAY['GHC'], 'AnitaB.org', 'https://ghc.com', user2, ARRAY[]::uuid[], NOW()),
('National Bravery Grant', 'For students with social impact.', 'Proven social work.', NOW() + INTERVAL '60 days', 'National Level', ARRAY['Social'], 'Ministry', 'https://bravery.com', user3, ARRAY[]::uuid[], NOW()),
('Regional Connect (West)', 'For west-zone students.', 'Home address in west.', NOW() + INTERVAL '28 days', 'State Level', ARRAY['West'], 'Regional Trust', 'https://west.com', user1, ARRAY[]::uuid[], NOW()),
('First Gen Scholarship', 'For first in family to attend.', 'First gen student.', NOW() + INTERVAL '35 days', 'National Level', ARRAY['FirstGen'], 'Open Doors Foundation', 'https://opendoors.com', user2, ARRAY[]::uuid[], NOW()),
('Men in Education', 'Encouraging diverse teachers.', 'Male student.', NOW() + INTERVAL '42 days', 'Male', ARRAY['Teaching'], 'EdCare', 'https://edcare.com', user3, ARRAY[]::uuid[], NOW()),
('Green Innovation Fund', 'Eco-friendly project funding.', 'Energy saving prototype.', NOW() + INTERVAL '70 days', 'National Level', ARRAY['Eco'], 'CleanCorp', 'https://green.com', user1, ARRAY[]::uuid[], NOW()),
('Gaming Merit Award', 'Best student team in region.', 'Win in inter-uni esport.', NOW() + INTERVAL '20 days', 'National Level', ARRAY['E-Sports'], 'Logitech', 'https://game-award.com', user2, ARRAY[]::uuid[], NOW()),
('Creative Arts Grant', 'Paint, music, or performance.', 'Portfolio required.', NOW() + INTERVAL '25 days', 'National Level', ARRAY['Arts'], 'Humanities Council', 'https://arts.com', user3, ARRAY[]::uuid[], NOW()),
('Disability Support Fund', 'Hearing aids and laptops.', 'Medical certificate.', NOW() + INTERVAL '38 days', 'National Level', ARRAY['Accessibility'], 'AccessNow', 'https://access.com', user1, ARRAY[]::uuid[], NOW()),
('Math Excellence Fund', 'For calculus toppers.', 'Exam score > 98%.', NOW() + INTERVAL '16 days', 'National Level', ARRAY['Math'], 'Newtonian Soc', 'https://math-top.com', user2, ARRAY[]::uuid[], NOW()),
('Google STEP Intern Fund', 'Travel grant for interns.', 'Accepted STEP offer.', NOW() + INTERVAL '12 days', 'Female', ARRAY['Google'], 'Google', 'https://step.com', user3, ARRAY[]::uuid[], NOW()),
('Sustainable Campus Fund', 'Project to reduce waste.', 'Working model.', NOW() + INTERVAL '65 days', 'State Level', ARRAY['Green'], 'State Eco Body', 'https://state-eco.com', user1, ARRAY[]::uuid[], NOW()),
('Heritage Legacy Fund', 'For students of history.', 'GPA > 3.0.', NOW() + INTERVAL '75 days', 'National Level', ARRAY['History'], 'Arch Soc', 'https://history.com', user2, ARRAY[]::uuid[], NOW()),
('Skill-Up Grant', 'Funding for Coursera/Udemy.', 'Proof of course comp.', NOW() + INTERVAL '15 days', 'National Level', ARRAY['Skills'], 'EduTrust', 'https://skillup.com', user3, ARRAY[]::uuid[], NOW()),
('Web3 Research Fund', 'Decentralized systems paper.', 'Research draft.', NOW() + INTERVAL '52 days', 'National Level', ARRAY['Crypto'], 'Ethereum Fdn', 'https://ether.com', user1, ARRAY[]::uuid[], NOW()),
('Harmony Fellowship', 'For peace building work.', 'Project on unity.', NOW() + INTERVAL '80 days', 'National Level', ARRAY['Peace'], 'Global Unity', 'https://harmony.com', user2, ARRAY[]::uuid[], NOW());

END $$;
