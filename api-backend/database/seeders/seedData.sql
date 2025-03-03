

INSERT INTO `users` (`UserID`, `Email`, `Name`, `Password`, `Role`, `PhoneNo`, `created_at`, `updated_at`) VALUES
(2, 'admin@gmail.com', 'admin', '$2y$10$VClWcj/.MKVJuKLxOdzDQ.psLXZGuECTSgyUe0qnqATl1oSwA35z2', 'Admin', '23424242', '2025-02-23 11:02:51', '2025-02-23 17:03:07'),
(3, 'manager@gmail.com', 'manager', '$2y$10$13M9TflpwtFrEpYB.JSxv.XkgPZiPhy0HsqJLiNNA7oSEHNqa0MQW', 'Manager', '4123214', '2025-02-23 12:10:39', '2025-02-23 18:15:56'),
(4, 'user@gmail.com', 'user', '$2y$10$kXKwY6Yn3rdFVQh1Iv.OJeH1P/GaQ8TdLe5jCKUxuaC.S3UudVO4u', 'User', '13233423', '2025-02-23 13:29:38', '2025-02-23 19:29:38'),
(5, 'vol@gmail.com', 'vol', '$2y$10$SakiBJzbY1KU4/yX52faO.KcexRdaDnPfbe9jEZlbNbW/C0K5S/aa', 'Volunteer', '324234234', '2025-02-24 12:03:34', '2025-02-24 18:03:34'),
(6, 'vol2@gmail.com', 'vol2', '$2y$10$oA2CJRfGrnWwThwFj/lyn.dSLKjhHQ2xuE2Dljx2wDJnoNlJxpbdu', 'Volunteer', '3244342', '2025-02-28 21:04:29', '2025-03-01 03:04:29'),
(7, 'vol3@gmail.com', 'vol3', '$2y$10$XkOAkL0e4uPhqI1f8usOMuVL784ioEWZDdAXmRBeI9BA2Mh7VE9BK', 'Volunteer', '452342', '2025-02-28 21:05:49', '2025-03-01 03:05:49');


INSERT INTO `relief_centers` (`CenterID`, `CenterName`, `Location`, `NumberOfVolunteersWorking`, `MaxVolunteersCapacity`, `ManagerID`, `created_at`, `updated_at`) VALUES
(1, 'Dhaka Flood Shelter', 'Mohakhali, Dhaka', 1, 50, 3, '2025-02-23 18:18:39', '2025-03-01 03:04:29'),
(2, 'CTG Flood Shelter', 'Chittagong, Chittagong', 1, 75, 3, '2025-02-23 18:19:40', '2025-03-01 03:05:49'),
(3, 'Khulna Help', 'Khulna', 1, 70, 3, '2025-02-23 19:22:28', '2025-02-24 18:03:34'),
(5, 'Japan', 'Japan', 0, 20, 3, '2025-02-23 19:28:05', '2025-02-23 19:28:05');



INSERT INTO `volunteers` (`VolunteerID`, `Name`, `ContactInfo`, `AssignedCenter`, `Status`, `UserID`, `created_at`, `updated_at`) VALUES
(1, 'vol', '324234234', 3, 'Active', 5, '2025-02-24 12:03:34', '2025-02-24 18:03:34'),
(2, 'vol2', '3244342', 1, 'Active', 6, '2025-02-28 21:04:29', '2025-03-01 03:04:29'),
(3, 'vol3', '452342', 2, 'Active', 7, '2025-02-28 21:05:49', '2025-03-01 03:05:49');




INSERT INTO `affected_areas` (`AreaID`, `AreaName`, `AreaType`, `SeverityLevel`, `Population`, `created_at`, `updated_at`) VALUES
(15, 'Dhaka', 'Flood', 'Low', 32424, '2025-02-25 11:13:11', '2025-02-25 11:13:11'),
(16, 'Khulba', 'Flood', 'Medium', 124342, '2025-02-25 11:24:41', '2025-02-25 11:24:41'),
(17, 'Barishal', 'Earthquake', 'Medium', 342342, '2025-02-25 11:25:50', '2025-02-25 11:25:50'),
(18, 'Dhaka', 'Fire', 'High', 234432, '2025-02-25 11:26:04', '2025-02-25 11:26:04');


INSERT INTO `aid_requests` (`RequestID`, `UserID`, `AreaID`, `RequesterName`, `ContactInfo`, `RequestType`, `Description`, `UrgencyLevel`, `Status`, `NumberOfPeople`, `RequestDate`, `ResponseTime`, `created_at`, `updated_at`) VALUES
(2, 4, 15, 'user', '3244', 'Rescue', 'deasfsdgf faesd', 'Medium', 'In Progress', 324, '2025-02-25 17:41:01', NULL, '2025-02-25 17:41:01', '2025-02-26 16:16:36'),
(3, 4, 17, 'user', '1231231', 'Aid', 'fesfs fsef sfs e', 'High', 'Completed', 231, '2025-02-25 17:49:16', '2025-03-03 00:18:19', '2025-02-25 17:49:17', '2025-03-02 18:18:19'),
(4, 4, 18, 'user', '342423', 'Aid', 'sdags sfefs f', 'Low', 'In Progress', 23, '2025-02-25 17:52:47', NULL, '2025-02-25 17:52:47', '2025-02-28 14:02:32'),
(5, 4, 16, 'user', '54354', 'Aid', 'sdfsd jhsfjs suehfius', 'Low', 'In Progress', 32, '2025-02-25 18:14:31', NULL, '2025-02-25 18:14:31', '2025-03-01 03:36:50');




INSERT INTO `donations` (`DonationID`, `DonorName`, `DonationType`, `Quantity`, `DateReceived`, `AssociatedCenter`, `UserID`, `created_at`, `updated_at`) VALUES
(1, 'user', 'Clothes', 323, '2025-02-23 18:23:44', 2, NULL, '2025-02-23 12:23:44', '2025-02-23 19:29:01'),
(2, 'Test Donor', 'Food', 100, '2025-02-24 00:30:55', 1, NULL, '2025-02-23 18:30:55', '2025-02-23 19:29:01'),
(3, 'user', 'Clothes', 100, '2025-02-23 18:33:34', 2, NULL, '2025-02-23 12:33:34', '2025-02-23 19:29:01'),
(4, 'user', 'Clothes', 200, '2025-02-23 18:34:39', 2, NULL, '2025-02-23 12:34:39', '2025-02-23 19:29:01'),
(5, 'user', 'Food', 300, '2025-02-23 18:36:00', 1, NULL, '2025-02-23 12:36:01', '2025-02-23 19:29:01'),
(6, 'user', 'Clothes', 10, '2025-02-23 18:44:23', 2, NULL, '2025-02-23 12:44:23', '2025-02-23 19:29:01'),
(7, 'user', 'Money', 200, '2025-02-23 18:46:11', 1, NULL, '2025-02-23 12:46:11', '2025-02-23 19:29:01'),
(8, 'user', 'Money', 300, '2025-02-23 18:46:34', 1, NULL, '2025-02-23 12:46:34', '2025-02-23 19:29:01'),
(9, 'user', 'Food', 342, '2025-02-25 17:59:03', 2, 4, '2025-02-25 11:59:03', '2025-02-25 11:59:03'),
(10, 'user', 'Water', 232, '2025-03-02 18:23:36', 5, 4, '2025-03-02 12:23:36', '2025-03-02 12:23:36');




INSERT INTO `aid_preparation` (`PreparationID`, `RequestID`, `DepartureTime`, `EstimatedArrival`, `created_at`, `updated_at`, `Status`) VALUES
(1, 2, '1970-01-01 00:00:00', '1970-01-01 00:00:00', '2025-02-28 12:55:20', '2025-03-02 15:19:54', 'Completed'),
(2, 3, '2025-03-10 10:00:00', '2025-03-31 06:00:00', '2025-02-28 13:57:18', '2025-03-01 18:32:21', 'Completed'),
(3, 4, '1970-01-01 06:00:00', '1970-01-01 06:00:00', '2025-02-28 14:02:32', '2025-03-01 15:49:42', 'Completed'),
(4, 5, '1970-01-01 00:00:00', '1970-01-01 00:00:00', '2025-03-01 03:36:49', '2025-03-01 03:36:49', 'Pending');



INSERT INTO `aid_preparation_volunteers` (`ID`, `PreparationID`, `VolunteerID`, `created_at`, `updated_at`) VALUES
(1, 1, 1, '2025-02-28 13:18:49', '2025-02-28 13:18:49'),
(5, 2, 1, '2025-02-28 14:06:30', '2025-02-28 14:06:30'),
(6, 3, 1, '2025-02-28 14:06:38', '2025-02-28 14:06:38'),
(7, 4, 3, '2025-03-01 03:36:50', '2025-03-01 03:36:50');




INSERT INTO `rescue_tracking` (`TrackingID`, `RequestID`, `TrackingStatus`, `OperationStartTime`, `NumberOfPeopleHelped`, `CompletionTime`, `created_at`, `updated_at`) VALUES
(1, 3, 'Completed', '2025-03-01 16:00:00', 213, '2025-03-02 23:28:25', '2025-03-01 12:15:53', '2025-03-02 17:28:25'),
(2, 4, 'In Progress', '1970-01-01 06:00:00', 0, NULL, '2025-03-01 15:49:42', '2025-03-01 15:49:42');



INSERT INTO `rescue_tracking_volunteers` (`ID`, `TrackingID`, `VolunteerID`, `created_at`, `updated_at`) VALUES
(31, 1, 1, '2025-03-01 18:32:04', '2025-03-01 18:32:04'),
(32, 1, 2, '2025-03-01 18:32:26', '2025-03-01 18:32:26');

