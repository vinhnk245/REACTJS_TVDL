-- MySQL dump 10.13  Distrib 8.0.13, for Win64 (x86_64)
--
-- Host: 13.251.27.111    Database: duonglieu_library_test
-- ------------------------------------------------------
-- Server version	5.7.32-0ubuntu0.18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
 SET NAMES utf8 ;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `book`
--

DROP TABLE IF EXISTS `book`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `book` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bookCategoryId` int(11) DEFAULT NULL,
  `name` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `code` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `qty` int(11) NOT NULL DEFAULT '1',
  `lost` int(11) NOT NULL DEFAULT '0',
  `available` int(11) NOT NULL DEFAULT '1',
  `note` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `description` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  `author` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `publishers` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `publishingYear` int(11) DEFAULT NULL,
  `createdMemberId` int(11) DEFAULT NULL,
  `createdDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedMemberId` int(11) DEFAULT NULL,
  `updatedDate` datetime DEFAULT NULL,
  `isActive` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `bookCategoryId` (`bookCategoryId`),
  KEY `createdMemberId` (`createdMemberId`),
  KEY `updatedMemberId` (`updatedMemberId`),
  CONSTRAINT `book_ibfk_19` FOREIGN KEY (`bookCategoryId`) REFERENCES `book_category` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `book_ibfk_20` FOREIGN KEY (`createdMemberId`) REFERENCES `member` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `book_ibfk_21` FOREIGN KEY (`updatedMemberId`) REFERENCES `member` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `book`
--

LOCK TABLES `book` WRITE;
/*!40000 ALTER TABLE `book` DISABLE KEYS */;
INSERT INTO `book` VALUES (1,8,'Hat giong tam hon tap 1','PTTH01',1,0,1,'Ban MH tang Thu vien','','Nhieu tac gia','First News',NULL,1,'2020-09-15 20:40:11',NULL,NULL,1),(2,8,'Hat giong tam hon tap 2','PTTH02',1,0,1,'','','Nhieu tac gia','First News',NULL,1,'2020-09-15 21:10:10',NULL,NULL,1),(3,8,'Hat giong tam hon tap 3','PTTH03',1,0,1,'','','Nhieu tac gia','First News',NULL,1,'2020-09-15 21:15:34',NULL,NULL,1),(4,8,'Hat giong tam hon tap 4','PTTH04',2,0,2,'','','Nhieu tac gia','First News',NULL,1,'2020-09-15 21:16:20',NULL,NULL,1),(5,4,'Chiến Binh Cầu Vồng (Tái Bản 2020)','VHC1',1,0,1,'','Một tác phẩm có tầm ảnh hưởng sâu rộng nhất Indonesia','ANDREA HIRATA','Nhà Xuất Bản Hội Nhà Văn',2020,1,'2020-09-15 21:20:00',NULL,NULL,1),(6,4,'Rừng Na Uy (Tái Bản Lần 3)','VHC2',2,0,2,'','Tiểu Thuyết Rừng Na Uy (Tái Bản)','HARUKI MURAKAMI','Nhà Xuất Bản Hội Nhà Văn',2014,1,'2020-09-15 21:22:26',NULL,NULL,1),(7,4,'Trường Làng Vẫn Ra Thế Giới','VHC3',1,0,1,'Anh Hưng tặng Thư viện','Tôi muốn đi du học để khám phá thế giới rộng lớn bên ngoài, một thế giới to hơn ngôi làng của tôi, to hơn con đường từ nhà tới trường và từ nhà lên rẫy của tôi. Tôi muốn nhìn xa hơn những đồi cà phê xanh ngá','Đỗ Liên Quang','Nhà Xuất Bản Hội Nhà Văn',2019,1,'2020-09-15 21:24:03',NULL,NULL,1),(8,4,'Hoàng Tử Bé (Tái Bản 2019)','VHC4',1,0,1,'','Cuốn sách đẹp như một bài thơ thanh sáng, một câu chuyện cổ tích về tình yêu thương, lòng nhân ái, ý nghĩa của sự tồn tại, về sự cảm thông giữa người với người','Saint Exupery','Nhà Xuất Bản Kim Đồng',2019,1,'2020-09-15 21:26:17',1,'2020-09-15 22:37:10',1),(9,1,'CHANG HOANG DÃ - GẤU','SĐB1',1,0,1,'Chị Trang WildAct tặng','CHANG HOANG DÃ - GẤU là cuốn artbook đầu tiên trong sê-ri tranh truyện Chang Hoang Dã của nhà bảo tồn động vật hoang dã Trang Nguyễn, được Nhà xuất bản Kim Đồng chính thức phát hành trong tháng 3/2020.','Trang Nguyễn, Jeet Zdung','NXB Kim Đồng',2020,1,'2020-09-19 00:36:15',NULL,NULL,1),(10,1,'Điểm Đến Của Cuộc Đời','SĐB2',1,0,1,'Talk & Share X-02','Điểm đến của cuộc đời kể lại một hành trình không thể nào quên cùng những người cận tử. Dấn thân vào “một thế giới của những bi kịch và tổn thất khổng lồ, của phẩm giá và lòng tự trọng trong hoàn cảnh khắc nghiệt, của sự phản bội và sợ hãi, của tình yêu mãnh liệt và hy vọng khôn nguôi, tóm lại, của tất cả những gì thuộc về con người, ở mức độ dữ dội nhất”, tác giả muốn đi tìm câu trả lời cho thôi thúc nội tâm: ta nên ứng xử thế nào trước cái chết, và sự chết có thể dạy ta điều gì cho cuộc sống?','Đặng Hoàng Giang','Nhã Nam',2018,1,'2020-09-19 00:42:55',NULL,NULL,1),(18,13,'Doraemon tap 3','TT1',1,0,1,'','','Fujiko Fujio','',1969,2,'2020-09-24 11:09:11',NULL,NULL,1),(19,13,'Doraemon tap 10','TT2',1,0,1,'','','Fujiko Fujio','',1969,2,'2020-09-24 11:09:58',NULL,NULL,1),(20,13,'Doraemon tap 45','TT3',1,0,1,'','','Fujiko Fujio','',1969,2,'2020-09-24 11:11:17',NULL,NULL,1),(21,13,'Songoku tap 1','TT4',1,0,1,'','','Toriyama Akira','',1984,2,'2020-09-24 11:12:49',NULL,NULL,1),(22,13,'Songoku tap 33','TT5',1,0,1,'','','Toriyama Akira','',1984,2,'2020-09-24 11:13:10',NULL,NULL,1),(23,13,'Songoku tap 57','TT6',1,0,1,'','','Toriyama Akira','',1984,2,'2020-09-24 11:19:59',NULL,NULL,1),(28,11,'admin','TT7',12,0,12,'121','12','12','12',12,3,'2020-12-02 16:30:14',3,'2020-12-02 16:36:10',0),(30,4,'Người Nhạy Cảm - Món Quà Hay Lời Nguyền','VHC5',1,0,1,'','Vậy rất có thể bạn là kiểu người CỰC KỲ NHẠY CẢM (Highly Sensitive Person), và có đến 15-20% dân số thế giới là người giống bạn cơ, nên đừng lo, cũng đừng sợ, bạn không phải KẺ KỲ LẠ DUY NHẤT.','ELAINE N. ARON','Nhà Xuất Bản Thế Giới',2019,3,'2020-12-08 11:18:20',NULL,NULL,1),(31,4,'Tôi Không Thích Ồn Ào','VHC6',1,0,1,'','Ồn ào là âm thanh của cuộc sống hiện đại tôn sùng vật chất và hư danh. Sống giữa ồn ào, con người khó mà tĩnh lặng. Khi tâm trí xao động, hỗn loạn, con người sẽ dễ dàng nổi nóng, đưa ra những quyết định sai lầm, dễ sinh bệnh tật, tự tổn thương chính mình.','ASHLEY DAVIS BUSH','Nhà Xuất Bản Hà Nội',2019,3,'2020-12-08 11:43:52',NULL,NULL,1);
/*!40000 ALTER TABLE `book` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `book_category`
--

DROP TABLE IF EXISTS `book_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `book_category` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `code` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `logo` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `description` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  `isActive` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `book_category`
--

LOCK TABLES `book_category` WRITE;
/*!40000 ALTER TABLE `book_category` DISABLE KEYS */;
INSERT INTO `book_category` VALUES (1,'Sách Đặc Biệt','SĐB','uploads/images/category/SĐB.png','Các loại sách có chữ ký tác giả, các bản in đặc biệt, các loại sách không được mượn về nhà',1),(2,'Sách Cổ Sách Quý','SCSQ','uploads/images/category/SCSQ.png','Các loại sách được xuất bản trước 1990',1),(3,'Tủ Sách Thiên Nhiên','TSTN','uploads/images/category/TSTN.png','Các loại sách về động, thực vật, tự nhiên. Tủ sách WildAct tặng',1),(4,'Văn Học Chung','VHC','uploads/images/category/VHC.png','Các loại sách văn học chung cho độ tuổi từ 15 trở lên',1),(5,'Kiến Thức Chung','KTC','uploads/images/category/KTC.png','Các loại sách kiến thức tương đương học sinh cấp 3 trở lên',1),(6,'Văn Học Thiếu Nhi','VHTN','uploads/images/category/VHTN.png','Các loại sách văn học tương đương học sinh cấp 2 trở xuống',1),(7,'Sách Ngoại Ngữ','SNN','uploads/images/category/SNN.png','Các loại sách viết bằng ngôn ngữ nước ngoài',1),(8,'Phát Triển Tâm Hồn','PTTH','uploads/images/category/PTTH.png','Các loại sách phát triển tâm hồn, selfhelp, hạt giống tâm hồn',1),(9,'Kiến Thức Thiếu Nhi','KTTN','uploads/images/category/KTTN.png','Các loại sách kiến thức tương đương học sinh cấp 2 trở xuống',1),(10,'Mẫu Giáo Tiểu Học','MGTH','uploads/images/category/MGTH.png','Các loại sách dành cho độ tuổi 1 - 10 tuổi, chủ yếu là sách tranh',1),(11,'Lịch Sử Văn Hoá','LSVH','uploads/images/category/LSVH.png','Các loại sách chủ đề chung về lịch sử, văn hóa',1),(12,'Khuyến Đọc','KĐ','uploads/images/category/KĐ.jpg','Các loại sách khuyến khích nên đọc',0),(13,'Truyện Tranh','TT','uploads/images/category/TT.png','Truyện tranh',1);
/*!40000 ALTER TABLE `book_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `book_image`
--

DROP TABLE IF EXISTS `book_image`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `book_image` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `bookId` int(11) NOT NULL,
  `image` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  `createdMemberId` int(11) DEFAULT NULL,
  `createdDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedMemberId` int(11) DEFAULT NULL,
  `updatedDate` datetime DEFAULT NULL,
  `isActive` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `bookId` (`bookId`),
  KEY `createdMemberId` (`createdMemberId`),
  KEY `updatedMemberId` (`updatedMemberId`),
  CONSTRAINT `book_image_ibfk_19` FOREIGN KEY (`bookId`) REFERENCES `book` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `book_image_ibfk_20` FOREIGN KEY (`createdMemberId`) REFERENCES `member` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `book_image_ibfk_21` FOREIGN KEY (`updatedMemberId`) REFERENCES `member` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `book_image`
--

LOCK TABLES `book_image` WRITE;
/*!40000 ALTER TABLE `book_image` DISABLE KEYS */;
INSERT INTO `book_image` VALUES (1,5,'uploads/images/books/42a37099d956e314a54bcbc6f3127108.jpeg',1,'2020-09-15 21:20:00',NULL,NULL,1),(2,9,'uploads/images/books/c3449955945491d9672d15fe4509552f.jpeg',1,'2020-09-15 21:20:00',NULL,NULL,1),(3,10,'uploads/images/books/d693fc4c2214871380c84a62e275095f.jpeg',1,'2020-09-15 21:20:00',NULL,NULL,1),(4,18,'uploads/images/books/aecd4519bfe5af01e50fb749017c0b57.jpeg',2,'2020-09-24 11:09:11',NULL,NULL,1),(5,19,'uploads/images/books/dbd1a78362fa559f2da2d354c71e2ab4.jpeg',2,'2020-09-24 11:09:58',NULL,NULL,1),(6,20,'uploads/images/books/f47622b47c19c68e196286a144d75b4c.jpeg',2,'2020-09-24 11:11:17',NULL,NULL,1),(7,21,'uploads/images/books/16d4301af26f85dbf4bab194982faf8d.jpeg',2,'2020-09-24 11:12:49',NULL,NULL,1),(8,22,'uploads/images/books/f0a8937bf2dd07e2ad42d68a78b800be.jpeg',2,'2020-09-24 11:13:11',NULL,NULL,1),(9,23,'uploads/images/books/f62752ee96961933e123267cbdccf19c.jpeg',2,'2020-09-24 11:20:00',NULL,NULL,1),(10,1,'uploads/images/books/hat_giong_tam_hon.jpg',2,'2020-09-24 11:20:00',NULL,NULL,1),(11,2,'uploads/images/books/hat_giong_tam_hon.jpg',2,'2020-09-24 11:20:00',NULL,NULL,1),(12,3,'uploads/images/books/hat_giong_tam_hon.jpg',2,'2020-09-24 11:20:00',NULL,NULL,1),(13,4,'uploads/images/books/hat_giong_tam_hon.jpg',2,'2020-09-24 11:20:00',NULL,NULL,1),(14,6,'uploads/images/books/rung_na_uy.jpg',2,'2020-09-24 11:20:00',NULL,NULL,1),(15,7,'uploads/images/books/truong_lang_van_ra_the_gioi.jpg',2,'2020-09-24 11:20:00',NULL,NULL,1),(16,8,'uploads/images/books/hoang_tu_be.jpg',2,'2020-09-24 11:20:00',NULL,NULL,1),(21,28,'uploads/images/books/c957d7782e7620c49722f3da27da465d.jpeg',3,'2020-12-02 16:30:14',3,'2020-12-02 16:34:51',1),(23,30,'uploads/images/books/29f197b4809fb23c6bc7a75f6cbdc75f.png',3,'2020-12-08 11:18:20',NULL,NULL,1),(24,31,'uploads/images/books/8ce1fc1604c374b4ea5d5bc3aed3c8ac.jpeg',3,'2020-12-08 11:43:52',NULL,NULL,1);
/*!40000 ALTER TABLE `book_image` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `event`
--

DROP TABLE IF EXISTS `event`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `event` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  `content` text COLLATE utf8_unicode_ci,
  `image` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  `linkGoogleForm` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  `eventDate` datetime DEFAULT NULL,
  `createdMemberId` int(11) DEFAULT NULL,
  `createdDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isActive` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `createdMemberId` (`createdMemberId`),
  CONSTRAINT `event_ibfk_1` FOREIGN KEY (`createdMemberId`) REFERENCES `member` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `event`
--

LOCK TABLES `event` WRITE;
/*!40000 ALTER TABLE `event` DISABLE KEYS */;
INSERT INTO `event` VALUES (7,'Đăng ký lớp học STEM','Với mục đích tạo ra sân chơi bổ ích cho các bạn nhỏ, Thư viện Dương Liễu tổ chức chương trình học STEM miễn phí. Chương trình nhằm đến việc Giúp các bạn nhỏ chủ động quan sát, phân tích sự kiện, hiện tượng, để từ đó ghi nhớ rất sâu kiến thức trong não bộ, liên kết các nguyên lý, khái niệm, những thí nghiệm, những vật dụng đơn giản hàng ngày để ứng dụng vào cuộc sống.','uploads/images/events/e8c1cb2be7ac74a601c9b6535edc959c.png','https://docs.google.com/forms/d/e/1FAIpQLSf1VzZISVqgheIXf8Fr_gi6oDQmkRoMmE_hJspVe3SA_5a5QA/viewform','2020-11-08 09:59:24',4,'2020-11-05 10:00:19',1),(8,'Đêm hội Halloween 2020 ','Đêm Halloween hàng năm tổ chức tại Thư viện Dương Liễu','uploads/images/events/0e807f1c78accc2476eaf0dd75dbbecc.jpeg','https://docs.google.com/forms/d/e/1FAIpQLSf1VzZISVqgheIXf8Fr_gi6oDQmkRoMmE_hJspVe3SA_5a5QA/viewform','2020-10-31 20:00:00',4,'2020-11-05 10:02:36',1),(9,'Chuyến đi ủng hộ Sách vở và lúa giống hướng về miền trung','Thư viện Dương Liễu kết hợp với Đoàn xã và Trường THCS','uploads/images/events/af14bc5345cbbf7342570ec176b77c18.jpeg','https://docs.google.com/forms/d/e/1FAIpQLSf1VzZISVqgheIXf8Fr_gi6oDQmkRoMmE_hJspVe3SA_5a5QA/viewform','2020-11-03 14:00:00',4,'2020-11-05 10:04:10',1),(10,'Du lịch Hà Giang dành cho các TNV Thư viện','Chuyến đi 7 ngày tìm hiểu văn hoá và trải nghiệm tại Lũng Phìn, Đồng Văn, Hà Giang','uploads/images/events/e21fdf820768764df75dc3337c9a3569.jpeg','https://docs.google.com/forms/d/e/1FAIpQLSf1VzZISVqgheIXf8Fr_gi6oDQmkRoMmE_hJspVe3SA_5a5QA/viewform','2020-10-28 12:00:00',4,'2020-11-05 10:06:55',1),(12,'1123','12','uploads/images/events/ade93b74dadbef888bcc60b996844f15.png','121','2020-12-11 07:00:00',3,'2020-12-08 14:35:08',0),(13,'s','s','uploads/images/events/92b0578e3310100b569c636099b266f1.jpeg','s','2020-12-10 00:00:00',3,'2020-12-08 14:43:45',0);
/*!40000 ALTER TABLE `event` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `lost_book`
--

DROP TABLE IF EXISTS `lost_book`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `lost_book` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `readerId` int(11) DEFAULT NULL,
  `memberId` int(11) DEFAULT NULL,
  `bookId` int(11) DEFAULT NULL,
  `rentedBookId` int(11) DEFAULT NULL,
  `createdMemberId` int(11) DEFAULT NULL,
  `createdDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isActive` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `readerId` (`readerId`),
  KEY `memberId` (`memberId`),
  KEY `bookId` (`bookId`),
  KEY `rentedBookId` (`rentedBookId`),
  KEY `createdMemberId` (`createdMemberId`),
  CONSTRAINT `lost_book_ibfk_26` FOREIGN KEY (`readerId`) REFERENCES `reader` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `lost_book_ibfk_27` FOREIGN KEY (`memberId`) REFERENCES `member` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `lost_book_ibfk_28` FOREIGN KEY (`bookId`) REFERENCES `book` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `lost_book_ibfk_29` FOREIGN KEY (`rentedBookId`) REFERENCES `rented_book` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `lost_book_ibfk_30` FOREIGN KEY (`createdMemberId`) REFERENCES `member` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `lost_book`
--

LOCK TABLES `lost_book` WRITE;
/*!40000 ALTER TABLE `lost_book` DISABLE KEYS */;
/*!40000 ALTER TABLE `lost_book` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `member`
--

DROP TABLE IF EXISTS `member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `member` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account` varchar(21) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `token` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `name` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `address` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `dob` datetime DEFAULT NULL,
  `joinedDate` datetime DEFAULT NULL,
  `phone` varchar(21) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `role` int(11) DEFAULT NULL,
  `status` int(11) NOT NULL DEFAULT '1',
  `note` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  `deviceId` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `createdMemberId` int(11) DEFAULT NULL,
  `createdDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isActive` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `member`
--

LOCK TABLES `member` WRITE;
/*!40000 ALTER TABLE `member` DISABLE KEYS */;
INSERT INTO `member` VALUES (1,'T01','$2b$10$XqwurYWRbV6hV.MbHcacEO/UR0pRRfUWd2goLyZqXUhkUvzWLKojG','5ee6e216b41270c52ef78ae5c36f9407','Phùng Bá Hưng','Đội 10, Dương Liễu','1990-07-07 00:00:00','2013-09-11 00:00:00','0906111808','thuvienduonglieu@gmail.com',1,1,NULL,'',NULL,'2020-09-11 23:59:00',1),(2,'T59','$2b$10$UkdhvHVrc5YgNk9pWo4oY.Ul.yJp0YN8fkw5fiFN5eEjKNmDkaXNS','db9b31e0753b8c72c042efa69947b951','Nguyễn Khắc Vinh','Đội 11, Dương Liễu','1998-05-24 00:00:00','2020-01-01 00:00:00','0968839496','',3,1,'1 chàng trai chuẩn mực',NULL,1,'2020-09-11 23:59:00',1),(3,'T02','$2b$10$j4mL2nT/JN.DrtpV47ld4uAQRUezOLSggz.odGLSms2lqceVmeXrG','c2c09cd5c44cbac09edc1a433c4fe5a4','Nguyễn Huy Tỉnh','Đội 5, Dương Liễu','1992-07-07 00:00:00',NULL,'0376978456','',2,1,'','',1,'2020-09-13 15:29:55',1),(4,'T03','$2b$10$dcsUqmDMMHsIK4kcLWXyZOv3fk8NnWfEkWGXbukNaDO8uMMnHI0NS','31387a4b854b107530f218f510fb8c9d','Đỗ Thị Kim Yến','Đội 4, Dương Liễu','1995-07-26 00:00:00',NULL,'0968278093','',2,1,'','',1,'2020-09-13 08:36:05',1),(5,'T04','$2b$10$dcsUqmDMMHsIK4kcLWXyZOv3fk8NnWfEkWGXbukNaDO8uMMnHI0NS','705272423275cdfa0f09e8af51084e2d','Thế Thị Hương','Đội 5, Dương Liễu','1992-08-06 00:00:00',NULL,'0989853690','',2,1,'','',1,'2020-09-13 16:34:43',1),(6,'T25','$2b$10$dcsUqmDMMHsIK4kcLWXyZOv3fk8NnWfEkWGXbukNaDO8uMMnHI0NS','1f627e819cdc4f46f71222d76b0c2c4e','Đỗ Thị Phương Anh','Đội 8, Dương Liễu','1999-04-25 00:00:00',NULL,'0364308484','',3,1,'','',1,'2020-09-13 17:13:59',1),(7,'T19','$2b$10$jU7XhMc/cbBBxrksBNWi6.oLRtOrvbHmYrhHBtnAMYQQWtTYOTzbi','d900cacf945d0c074ddbfc54c71f8ef3','Nguyễn Thị Phương Thảo','Đội 7A, Dương Liễu','2002-10-19 00:00:00',NULL,'0377000469','',3,1,'','',1,'2020-09-13 17:18:52',1),(8,'T18','$2b$10$dcsUqmDMMHsIK4kcLWXyZOv3fk8NnWfEkWGXbukNaDO8uMMnHI0NS',NULL,'Trần Minh Hương','Đội 11, Dương Liễu','2002-08-17 00:00:00',NULL,'0987446908','',3,1,'',NULL,1,'2020-09-13 17:21:39',1),(9,'T24','$2b$10$dcsUqmDMMHsIK4kcLWXyZOv3fk8NnWfEkWGXbukNaDO8uMMnHI0NS','3ca581891b75027ea62ace9521becc82','Nguyễn Mai Hương','Đội 5, Dương Liễu','2001-10-22 00:00:00',NULL,'0935778312','',3,1,'','',1,'2020-09-13 17:22:48',1),(10,'T21','$2b$10$dcsUqmDMMHsIK4kcLWXyZOv3fk8NnWfEkWGXbukNaDO8uMMnHI0NS','0614bfebf9c860cff3a3c21e51945725','Nguyễn Thảo Ngọc','Đội 8, Dương Liễu','2001-08-28 00:00:00',NULL,'0933229496','',3,1,'','',1,'2020-09-13 22:31:58',1),(12,'T70','$2b$10$3ADpUJm3E/mRVCzGa0RsdOeYbQ/iIIcmI./dCG1EjVvQSRiMcwJFa',NULL,'Trần Thị Ninh','Đội 11, Dương Liễu','1998-08-17 07:00:00','2020-10-07 22:28:44','0966456123','',3,1,'note',NULL,5,'2020-10-07 22:28:43',1),(13,'TV98','$2b$10$J0UVTTMJCmPB3zZYYfAthOH3rqheGRggUnXxWXAL/NNFmLAm25HRC',NULL,'Đỗ Văn Sỹ','Thường Tín','2001-08-28 00:00:00',NULL,'0933221234','',3,1,'',NULL,5,'2020-11-20 09:26:48',0),(14,'T60','$2b$10$Jh42ZwbcykVdu1uK7rPd9.PN9/anb6LuGtXOh7EFA9Uhr8Kz//AFG',NULL,'Nguyễn Xuân Hùng','Chương Mỹ','1998-11-03 00:00:00',NULL,'0987651111','hung@gmail.com',3,1,NULL,NULL,3,'2020-11-20 11:53:12',0),(15,'T61','$2b$10$9I41DXu3vlJVJOfFQDBAvelYfDposI94atPsyeq9W4QbFRKeyJokK',NULL,'Đỗ Văn Sỹ','Thường Tín, Hà Nội','1998-10-07 00:00:00',NULL,'0964781698','dovansy.info@gmail.com',3,0,'',NULL,3,'2020-11-20 12:13:00',1),(16,'T16','$2b$10$LKaFa4Ipr2N2bjV9JPp00O2K3oregTx8cTqBRal.ds4w3x3aB9ZJK',NULL,'Nguyễn Danh Nhân','Đội 4, Dương Liễu','2001-10-01 00:00:00','2016-07-22 00:00:00','0345999274','nhan2k1@gmail.com',3,1,'ok',NULL,1,'2020-11-28 09:27:54',1),(17,'T168','$2b$10$PsAG6n/XrQzYgeRr0LXvFO7EXsALKbUA..EyzbXzRItT3VE0nzxE2',NULL,'Nguyễn Văn Triệu Duy','Đội 7A, Dương Liễu','2001-04-20 00:00:00',NULL,'0988019274','trieuduy@gmail.com',3,1,'ok',NULL,1,'2020-11-28 09:30:56',1),(18,'T20','$2b$10$/nDMVAxJRlCnk8lyoLiBu.rtOctAne/24kc8LhaXKnnIzctgg8i/e',NULL,'Nguyễn Kiến An','Đội 5','2001-04-29 00:00:00',NULL,'0399816725','ankien@gmail.com',3,1,'',NULL,1,'2020-11-28 09:35:16',1),(19,'T22','$2b$10$F2T66Z34t0/Nfq/yJNdBWuZhD6Xf7iVRxAIS/5pD6kS3V2T2gtDxy',NULL,'Nguyễn Tiến Sơn','Đội 2, Dương Liễu','2001-05-09 00:00:00',NULL,'0957226391','sonbe@gmail.com',2,1,NULL,NULL,1,'2020-11-28 09:39:23',1),(20,'T33','$2b$10$cuLLwfSco0S5wc18VE27eeTuwJN/K62PLgeMz2ZHhOsH/3FyJMGdK',NULL,'Đỗ Văn Sỹ','Khánh Hà, Thường Tín, Hà Nội','1998-10-07 00:00:00',NULL,'0966349308','dovansy.info@gmail.com',3,1,'Độc toàn thân',NULL,3,'2020-12-15 16:38:34',0),(21,'T35','$2b$10$E4ddZ4oTlBZ5KznXx/koGOKLHrKhZ8HY87qDmF27weAxCrX/gjc2O',NULL,'DO VAN SY','HA NOI','1998-10-07 00:00:00',NULL,'0987654321','dovansyy@gmail.com',3,1,'note',NULL,3,'2020-12-15 16:43:49',0),(22,'T28','$2b$10$S1yqAK995XULpKcxRMA6ge1IME0E30cgt2vRpXdEo0IF6erqwE3Zu',NULL,'Nguyễn Quang Vũ','Đội 9, Dương Liễu','2020-12-03 00:00:00',NULL,'0960178278','vunguyen28@gmail.com',3,1,NULL,NULL,1,'2020-12-16 10:47:56',1);
/*!40000 ALTER TABLE `member` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reader`
--

DROP TABLE IF EXISTS `reader`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `reader` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `account` varchar(21) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `token` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `name` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `address` varchar(200) COLLATE utf8_unicode_ci NOT NULL,
  `dob` datetime DEFAULT NULL,
  `cardNumber` int(11) NOT NULL,
  `parentName` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `parentPhone` varchar(21) COLLATE utf8_unicode_ci DEFAULT NULL,
  `rank` int(11) DEFAULT NULL,
  `avatar` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  `note` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  `lost` int(11) NOT NULL DEFAULT '0',
  `status` int(11) NOT NULL DEFAULT '1',
  `deviceId` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `createdMemberId` int(11) DEFAULT NULL,
  `createdDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isActive` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `createdMemberId` (`createdMemberId`),
  CONSTRAINT `reader_ibfk_1` FOREIGN KEY (`createdMemberId`) REFERENCES `member` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reader`
--

LOCK TABLES `reader` WRITE;
/*!40000 ALTER TABLE `reader` DISABLE KEYS */;
INSERT INTO `reader` VALUES (1,'TVDL1','$2b$10$0wlUwqt5Z7dp3TQkrkqvL.IcLSSVJgwEx5K5TQY1ZSQFgRJVhhl4u','c44117e30fc63c218c4ced322fa14651','Trần Anh Minh','Lê Văn Hưu, 2BT, HN','1998-04-16 00:00:00',1,'Trần Anh Nam','0988263014',NULL,NULL,'',17,1,'',2,'2020-09-13 22:04:48',1),(2,'TVDL2','$2b$10$Q.l7NeWBqM/peI3DVmd9POtv2PsTvPUOvcwUSQlxfAIGYA93d76La','a6f8dc5bddd8f98968332af36ddbdc31','Nguyễn Trọng An','Đội 5 Cát Quế Hoài Đức','2005-02-11 00:00:00',2,'Nguyễn Trọng Toán','0356119872',NULL,NULL,'',0,1,'',2,'2020-09-13 22:08:34',1),(3,'TVDL3','$2b$10$PySBsWSMlnwXF9KuHRNW8..yr7fxzGaxSOoD2CHMo8mmRWG19RupW','f4c536a014636e7e8f4994e9799b6ca6','Phạm Văn Trường','Kim Sơn, Ninh Bình','1998-02-11 00:00:00',3,'Phạm Lâm','0912854643',NULL,NULL,'',0,1,'',2,'2020-09-13 22:18:12',1),(4,'TVDL4','$2b$10$Jyds/UKODgtq7r9iyfkS5O.PYGMckqBYBgv13W243UWQLl2gc1vBi',NULL,'Hoàng Khánh Vy','02 Kim Giang, Thanh Xuân, HN','2006-06-23 00:00:00',4,'Hoàng Minh Quang','0887256012',NULL,NULL,'',1,1,NULL,2,'2020-09-13 22:19:55',1),(5,'TVDL5','$2b$10$RTyXTCxfQ90ysm5RyaeN4uJVo8HLFJB3j9mvHKkvZAeI3RIq/lzWy','55926b2dfafd1019e606cb52800541f6','Phương Linh Phi','Xóm Quê, Đội 6','2002-10-30 00:00:00',5,'Phi Nhung','0966145088',NULL,NULL,'',0,1,'',2,'2020-09-13 22:21:35',0),(6,'TVDL6','$2b$10$ecii1RD/hglSn80iuk1.Lum7HotDlrVvv/lQ2xHCgYM8oeDL4Ovxa',NULL,'Nguyễn Kiến An','Đội 5, Dương Liễu','2001-04-14 00:00:00',6,'Nguyễn Kiến Hưởng','0907145045',NULL,NULL,'',0,1,NULL,2,'2020-09-13 22:23:19',1),(7,'TVDL7','$2b$10$UFtbSTbcGCWxA5NTvdkC8u0M1U5qF6bNeWv2FW.JIk2.T4TaXTTtu',NULL,'Thảo Ngọc','Dương Liễu','2002-08-28 00:00:00',7,'Nguyễn Bảo Nam','0933784156',NULL,NULL,'',0,1,NULL,2,'2020-09-13 22:24:32',1),(8,'TVDL8','$2b$10$tPj4Y5eaac1URasNi8TnHOv70gFRHpdkEiyb/4dbjkWkRiLVkPvn2','a9b50aee2743d6e172cc2a98caffdce2','Nguyễn Linh Chi','KĐT Lideco','2002-05-16 00:00:00',8,'Cô Ngọc','0366982123',NULL,NULL,'',0,1,'',2,'2020-09-13 22:26:58',1),(9,'TVDL9','$2b$10$UcxJB2DCdVQoLCGeZ0vSaOR2NPgXXLf0L33U2.0k.TLBNp4hAJNfe','61c5925cbc82b76eb553cb8b39d1d245','Lê Đức Anh','KĐT Tân Tây Đô','2009-01-17 06:45:10',9,'Lê Đức Tùng','0988663181',NULL,NULL,'',0,1,'',2,'2020-09-13 23:05:15',1),(10,'TVDL10','$2b$10$dje.HS/nYYxLYYTJ7cpZWuxxuAjRfoGNiwt87T6Knty7QWxrfbfAi',NULL,'Nguyễn Xuân Hùng','Phụng Châu, Chương Mỹ','1998-11-11 00:00:00',10,'Nguyễn Xuân Cương',NULL,NULL,NULL,NULL,0,1,NULL,3,'2020-11-20 15:33:31',0),(11,'TVDL11','$2b$10$iO5yRkhncQVnGC7Vf58ZQOZ882fT7vdAQChIQIo.QcSDZqhe2rynu',NULL,'Nguyễn Xuân Hùng','Chương Mỹ','1998-11-03 00:00:00',11,'Nguyễn Xuân Cương','',NULL,NULL,'',0,1,NULL,3,'2020-11-20 15:34:34',0),(12,'TVDL12','$2b$10$eKwacdJmBjZ9XNo5ZBCJu.of0bbjivStCM/oYviII.1VomHslNhP.',NULL,'Nguyễn Xuân Hùng','Phụng Châu, Chương Mỹ','1998-11-11 00:00:00',12,'Nguyễn Xuân Cương','0987654321',NULL,NULL,'note',0,1,NULL,3,'2020-11-20 15:36:46',0),(13,'TVDL13','$2b$10$Y/iPlXPlns11DEkXf3gGbOI4QeTiB9uGTANxuZYVgwS/eztuJ10o6',NULL,'Nguyễn Xuân Hùng','Phụng Châu, Chương Mỹ','2006-05-26 07:00:00',13,'Nguyễn Xuân Cương','0987654321',NULL,NULL,'note',0,1,NULL,3,'2020-11-20 15:42:03',1),(14,'TVDL14','$2b$10$PCGWtoOWvgYVBIvv0ZByrOxjcNUFlEtVpWkhsDeNDv7vjVAhfzP8.',NULL,'Nguyễn Quang Vũ','Yên Sở, Hoài Đức','2001-11-28 07:00:00',14,'Nguyễn Quang Hùng','0336724198',NULL,NULL,'',0,1,NULL,1,'2020-11-28 09:16:42',1),(15,'TVDL15','$2b$10$cNxmfXyQ1wpFCpu34KHhu.sKvHAFAt4iVc62RrU441Cs71fwQT4ZC',NULL,'Bùi Minh Chiến','Hải Dương','1998-10-30 00:00:00',15,'Mẹ Uyên','0977166273',NULL,NULL,'ab',0,1,NULL,1,'2020-11-28 09:18:52',1);
/*!40000 ALTER TABLE `reader` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rented_book`
--

DROP TABLE IF EXISTS `rented_book`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `rented_book` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `readerId` int(11) DEFAULT NULL,
  `status` int(11) NOT NULL,
  `noteMember` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  `borrowedDate` datetime DEFAULT NULL,
  `borrowedConfirmMemberId` int(11) DEFAULT NULL,
  `returnedDate` datetime DEFAULT NULL,
  `returnedConfirmMemberId` int(11) DEFAULT NULL,
  `isCreatedByMember` int(11) NOT NULL,
  `createdObjectId` int(11) NOT NULL,
  `createdDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `isActive` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `readerId` (`readerId`),
  KEY `borrowedConfirmMemberId` (`borrowedConfirmMemberId`),
  KEY `returnedConfirmMemberId` (`returnedConfirmMemberId`),
  CONSTRAINT `rented_book_ibfk_18` FOREIGN KEY (`readerId`) REFERENCES `reader` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `rented_book_ibfk_19` FOREIGN KEY (`borrowedConfirmMemberId`) REFERENCES `member` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `rented_book_ibfk_20` FOREIGN KEY (`returnedConfirmMemberId`) REFERENCES `member` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=72 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rented_book`
--

LOCK TABLES `rented_book` WRITE;
/*!40000 ALTER TABLE `rented_book` DISABLE KEYS */;
INSERT INTO `rented_book` VALUES (4,7,2,'','2020-09-26 17:35:09',2,'2020-10-03 14:52:12',6,1,2,'2020-09-29 17:35:10',1),(5,8,2,'','2020-09-29 17:37:45',9,'2020-10-03 14:52:25',6,1,9,'2020-09-29 17:37:46',1),(6,4,2,'','2020-09-30 08:15:25',6,'2020-10-01 11:38:22',2,1,6,'2020-09-30 08:15:27',1),(7,3,2,'','2020-09-30 08:16:35',6,'2020-10-13 09:28:31',2,1,6,'2020-09-30 08:16:36',1),(8,2,2,'','2020-09-30 08:17:32',6,'2020-10-13 09:28:38',2,1,6,'2020-09-30 08:17:33',1),(9,5,2,'','2020-09-30 08:18:32',6,'2020-10-06 13:57:42',5,1,6,'2020-09-30 08:18:33',1),(12,9,3,'Mấy quyển này hiện đang hết.','2020-10-06 11:45:24',2,NULL,NULL,0,9,'2020-10-03 14:37:43',1),(13,8,2,NULL,'2020-10-06 13:47:01',2,'2020-10-10 13:47:01',9,0,8,'2020-10-03 14:54:15',1),(14,5,0,NULL,NULL,NULL,NULL,NULL,0,5,'2020-10-06 13:58:18',1),(16,8,0,NULL,NULL,NULL,NULL,NULL,0,8,'2020-10-06 14:04:03',1),(24,2,2,'','2020-10-13 10:05:18',9,'2020-12-11 10:31:13',7,1,9,'2020-10-13 10:05:18',1),(25,9,2,'','2020-10-13 10:28:28',9,'2020-12-11 10:31:17',7,1,9,'2020-10-13 10:28:28',1),(30,3,0,NULL,NULL,NULL,NULL,NULL,0,3,'2020-11-10 14:26:37',1),(49,1,3,'het sach r','2020-11-17 20:40:27',2,NULL,NULL,0,1,'2020-11-16 14:54:13',1),(50,1,2,'','2020-11-17 16:19:24',2,'2020-11-17 20:26:30',NULL,1,2,'2020-11-17 16:19:24',1),(51,1,2,NULL,'2020-11-17 20:42:08',2,'2020-12-07 08:41:12',NULL,0,1,'2020-11-17 20:41:08',1),(52,1,2,NULL,'2020-12-07 08:43:50',2,'2020-12-07 08:48:50',NULL,0,1,'2020-12-07 08:42:15',1),(53,1,2,'','2020-12-08 09:39:13',2,'2020-12-11 10:26:50',7,1,2,'2020-12-08 09:39:13',1),(54,3,2,'','2020-12-11 09:55:18',7,'2020-12-15 13:42:29',3,1,7,'2020-12-11 09:55:18',1),(55,6,2,'','2020-12-11 09:56:20',7,'2020-12-15 13:41:34',3,1,7,'2020-12-11 09:56:20',1),(56,6,2,'','2020-12-15 13:43:48',7,NULL,NULL,1,7,'2020-12-15 13:43:48',1),(57,8,2,'','2020-12-15 13:44:05',7,'2020-12-15 14:07:38',3,1,7,'2020-12-15 13:44:05',1),(58,8,2,'','2020-12-15 14:30:34',7,NULL,NULL,1,7,'2020-12-15 14:30:34',1),(59,1,2,'','2020-12-15 14:31:16',7,'2020-12-15 15:06:24',3,1,7,'2020-12-15 14:31:16',1),(60,9,2,'','2020-12-15 15:53:10',3,NULL,NULL,1,3,'2020-12-15 15:53:10',1),(61,15,2,'','2020-12-15 15:55:16',3,'2020-12-15 15:55:40',3,1,3,'2020-12-15 15:55:16',1),(62,15,2,'note','2020-12-15 15:56:05',3,NULL,NULL,1,3,'2020-12-15 15:56:05',1),(63,7,2,'note','2020-12-15 16:03:35',3,NULL,NULL,1,3,'2020-12-15 16:03:35',1),(64,14,2,'','2020-12-15 16:58:25',3,'2020-12-15 16:58:29',3,1,3,'2020-12-15 16:58:25',1),(65,15,1,'','2020-12-15 16:59:18',3,NULL,NULL,1,3,'2020-12-15 16:59:18',1),(66,13,1,NULL,'2020-12-16 10:52:52',1,NULL,NULL,1,1,'2020-12-16 10:52:52',1),(67,9,1,'','2020-12-16 11:37:10',1,NULL,NULL,1,1,'2020-12-16 11:37:10',1),(68,3,1,'','2020-12-16 11:37:30',1,NULL,NULL,1,1,'2020-12-16 11:37:30',1),(69,14,1,'','2020-12-16 11:37:41',1,NULL,NULL,1,1,'2020-12-16 11:37:41',1),(70,1,1,'','2020-12-16 11:38:31',1,NULL,NULL,1,1,'2020-12-16 11:38:31',1),(71,8,1,'','2020-12-16 11:39:14',1,NULL,NULL,1,1,'2020-12-16 11:39:14',1);
/*!40000 ALTER TABLE `rented_book` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rented_book_detail`
--

DROP TABLE IF EXISTS `rented_book_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `rented_book_detail` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `readerId` int(11) DEFAULT NULL,
  `rentedBookId` int(11) NOT NULL,
  `bookId` int(11) NOT NULL,
  `qty` int(11) NOT NULL DEFAULT '1',
  `lost` int(11) NOT NULL DEFAULT '0',
  `status` int(11) NOT NULL,
  `borrowedDate` datetime DEFAULT NULL,
  `borrowedConfirmMemberId` int(11) DEFAULT NULL,
  `returnedDate` datetime DEFAULT NULL,
  `returnedConfirmMemberId` int(11) DEFAULT NULL,
  `note` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  `outOfDate` int(11) DEFAULT '0',
  `isActive` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `rented_book_detail_readerId_foreign_idx` (`readerId`),
  KEY `rentedBookId` (`rentedBookId`),
  KEY `bookId` (`bookId`),
  KEY `borrowedConfirmMemberId` (`borrowedConfirmMemberId`),
  KEY `returnedConfirmMemberId` (`returnedConfirmMemberId`),
  CONSTRAINT `rented_book_detail_ibfk_15` FOREIGN KEY (`rentedBookId`) REFERENCES `rented_book` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rented_book_detail_ibfk_16` FOREIGN KEY (`bookId`) REFERENCES `book` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `rented_book_detail_ibfk_17` FOREIGN KEY (`borrowedConfirmMemberId`) REFERENCES `member` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `rented_book_detail_ibfk_18` FOREIGN KEY (`returnedConfirmMemberId`) REFERENCES `member` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT `rented_book_detail_readerId_foreign_idx` FOREIGN KEY (`readerId`) REFERENCES `reader` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=157 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rented_book_detail`
--

LOCK TABLES `rented_book_detail` WRITE;
/*!40000 ALTER TABLE `rented_book_detail` DISABLE KEYS */;
INSERT INTO `rented_book_detail` VALUES (7,7,4,8,1,0,2,'2020-09-26 17:35:09',2,'2020-10-03 14:52:12',6,NULL,0,1),(8,7,4,7,1,0,2,'2020-09-26 17:35:09',2,'2020-10-03 14:52:12',6,NULL,0,1),(9,7,4,6,1,0,2,'2020-09-26 17:35:09',2,'2020-10-03 14:52:12',6,NULL,0,1),(10,8,5,1,1,0,2,'2020-09-29 17:37:45',9,'2020-10-03 14:52:25',6,NULL,0,1),(11,8,5,23,1,0,2,'2020-09-29 17:37:45',9,'2020-10-03 14:52:25',6,NULL,0,1),(12,8,5,2,1,0,2,'2020-09-29 17:37:45',9,'2020-10-03 14:52:25',6,NULL,0,1),(13,4,6,7,1,0,2,'2020-09-30 08:15:26',6,'2020-10-01 09:18:06',1,NULL,0,1),(14,4,6,6,1,1,2,'2020-09-30 08:15:26',6,'2020-10-01 11:38:22',2,'Bạn này làm mất sách và đền 50k',0,1),(15,3,7,5,1,0,2,'2020-09-30 08:16:36',6,'2020-10-13 09:28:31',2,NULL,6,1),(16,3,7,4,1,0,2,'2020-09-30 08:16:36',6,'2020-10-13 09:28:31',2,NULL,6,1),(17,2,8,20,1,0,2,'2020-09-30 08:17:32',6,'2020-10-13 09:28:38',2,NULL,6,1),(18,2,8,4,1,0,2,'2020-09-30 08:17:32',6,'2020-10-13 09:28:38',2,NULL,6,1),(19,5,9,10,1,0,2,'2020-09-30 08:18:32',6,'2020-10-06 13:57:42',5,NULL,0,1),(20,5,9,9,1,0,2,'2020-09-30 08:18:32',6,'2020-10-06 13:57:42',5,NULL,0,1),(26,9,12,10,1,0,3,'2020-10-06 11:45:24',2,NULL,NULL,NULL,0,1),(27,9,12,22,1,0,3,'2020-10-06 11:45:24',2,NULL,NULL,NULL,0,1),(28,8,13,1,1,0,2,'2020-10-06 13:47:01',2,'2020-10-10 13:47:01',9,'Fix don loi nay!',0,1),(29,8,13,2,1,0,2,'2020-10-06 13:47:01',2,'2020-10-10 13:47:01',9,NULL,0,1),(30,8,13,3,1,0,2,'2020-10-06 13:47:01',2,'2020-10-10 13:47:01',9,NULL,0,1),(31,5,14,5,1,0,0,NULL,NULL,NULL,NULL,NULL,0,1),(34,8,16,7,1,0,0,NULL,NULL,NULL,NULL,NULL,0,1),(35,8,16,8,1,0,0,NULL,NULL,NULL,NULL,NULL,0,1),(43,2,24,3,1,0,2,'2020-10-13 10:05:18',9,'2020-12-11 10:31:13',7,NULL,52,1),(44,2,24,6,1,0,2,'2020-10-13 10:05:18',9,'2020-12-11 10:31:13',7,NULL,52,1),(45,2,24,8,1,0,2,'2020-10-13 10:05:18',9,'2020-12-11 10:31:13',7,NULL,52,1),(46,9,25,23,1,0,2,'2020-10-13 10:28:28',9,'2020-12-11 10:31:17',7,NULL,52,1),(47,9,25,8,1,0,2,'2020-10-13 10:28:28',9,'2020-12-11 10:31:17',7,NULL,52,1),(59,3,30,6,1,0,0,NULL,NULL,NULL,NULL,NULL,0,0),(60,3,30,8,1,0,0,NULL,NULL,NULL,NULL,NULL,0,1),(61,3,30,10,1,0,0,NULL,NULL,NULL,NULL,NULL,0,1),(62,3,30,6,1,0,0,NULL,NULL,NULL,NULL,NULL,0,0),(106,1,49,8,1,0,3,'2020-11-17 20:40:27',2,NULL,NULL,NULL,0,1),(107,1,50,10,1,0,2,'2020-11-17 16:19:24',2,'2020-11-17 20:26:06',2,'',0,1),(108,1,50,7,1,0,2,'2020-11-17 16:19:24',2,'2020-11-17 20:26:30',2,'',0,1),(109,1,51,20,1,0,2,'2020-11-17 20:42:08',2,'2020-12-07 08:41:10',2,'',0,1),(110,1,51,8,1,0,2,'2020-11-17 20:42:08',2,'2020-12-07 08:41:12',2,'',0,1),(111,1,51,10,1,1,2,'2020-11-17 20:42:08',2,'2020-12-07 08:41:26',2,'test',0,1),(112,1,52,23,1,0,2,'2020-12-07 08:43:50',2,'2020-12-07 08:48:49',2,'',0,1),(113,1,52,10,1,0,2,'2020-12-07 08:43:50',2,'2020-12-07 08:48:50',2,'',0,1),(114,1,53,10,1,0,2,'2020-12-08 09:39:13',2,'2020-12-11 10:26:50',7,NULL,0,1),(115,1,53,7,1,0,2,'2020-12-08 09:39:13',2,'2020-12-11 10:26:50',7,NULL,0,1),(116,3,54,31,1,0,2,'2020-12-11 09:55:18',7,'2020-12-15 13:42:29',3,NULL,0,1),(117,3,54,30,1,0,2,'2020-12-11 09:55:18',7,'2020-12-15 13:42:29',3,NULL,0,1),(118,6,55,10,1,0,2,'2020-12-11 09:56:20',7,'2020-12-15 13:41:34',3,NULL,0,1),(119,6,55,30,1,0,2,'2020-12-11 09:56:20',7,'2020-12-15 13:41:34',3,NULL,0,1),(120,6,56,31,1,1,2,'2020-12-15 13:43:48',7,'2020-12-15 14:20:33',3,'note',0,1),(121,6,56,10,1,1,2,'2020-12-15 13:43:48',7,'2020-12-15 14:21:54',3,'',0,1),(122,6,56,30,1,0,2,'2020-12-15 13:43:48',7,'2020-12-15 14:23:07',3,'',0,1),(123,8,57,31,1,0,2,'2020-12-15 13:44:05',7,'2020-12-15 14:07:38',3,NULL,0,1),(124,8,57,10,1,0,2,'2020-12-15 13:44:05',7,'2020-12-15 14:07:38',3,NULL,0,1),(125,8,57,22,1,0,2,'2020-12-15 13:44:05',7,'2020-12-15 14:07:38',3,NULL,0,1),(126,8,58,22,1,1,2,'2020-12-15 14:30:34',7,'2020-12-15 15:06:37',3,'',0,1),(127,8,58,30,1,1,2,'2020-12-15 14:30:34',7,'2020-12-15 15:06:46',3,'',0,1),(128,1,59,19,1,1,2,'2020-12-15 14:31:16',7,'2020-12-15 15:06:17',3,'',0,1),(129,1,59,31,1,0,2,'2020-12-15 14:31:16',7,'2020-12-15 15:06:24',3,NULL,0,1),(130,9,60,31,1,1,2,'2020-12-15 15:53:10',3,'2020-12-15 16:50:31',3,'',0,1),(131,9,60,30,1,1,2,'2020-12-15 15:53:10',3,'2020-12-15 16:50:36',3,'',0,1),(132,9,60,23,1,1,2,'2020-12-15 15:53:10',3,'2020-12-15 16:50:52',3,'',0,1),(133,15,61,31,1,0,2,'2020-12-15 15:55:16',3,'2020-12-15 15:55:40',3,NULL,0,1),(134,15,61,30,1,0,2,'2020-12-15 15:55:16',3,'2020-12-15 15:55:40',3,NULL,0,1),(135,15,61,22,1,0,2,'2020-12-15 15:55:16',3,'2020-12-15 15:55:40',3,NULL,0,1),(136,15,62,31,1,1,2,'2020-12-15 15:56:05',3,'2020-12-15 16:51:25',3,'',0,1),(137,15,62,23,1,0,2,'2020-12-15 15:56:05',3,'2020-12-15 16:51:29',3,'',0,1),(138,15,62,30,1,0,2,'2020-12-15 15:56:05',3,'2020-12-15 16:51:33',3,'',0,1),(139,7,63,30,1,0,2,'2020-12-15 16:03:35',3,'2020-12-15 16:44:29',3,'',0,1),(140,7,63,31,1,0,2,'2020-12-15 16:03:35',3,'2020-12-15 16:50:11',3,'',0,1),(141,14,64,30,1,0,2,'2020-12-15 16:58:25',3,'2020-12-15 16:58:29',3,NULL,0,1),(142,14,64,23,1,0,2,'2020-12-15 16:58:25',3,'2020-12-15 16:58:29',3,NULL,0,1),(143,15,65,30,1,0,1,'2020-12-15 16:59:18',3,NULL,NULL,NULL,0,1),(144,13,66,30,1,0,1,'2020-12-16 10:52:52',1,NULL,NULL,NULL,0,1),(145,13,66,21,1,0,1,'2020-12-16 10:52:52',1,NULL,NULL,NULL,0,1),(146,13,66,3,1,0,1,'2020-12-16 10:52:52',1,NULL,NULL,NULL,0,1),(147,9,67,5,1,0,1,'2020-12-16 11:37:10',1,NULL,NULL,NULL,0,1),(148,3,68,19,1,0,1,'2020-12-16 11:37:30',1,NULL,NULL,NULL,0,1),(149,3,68,6,1,0,1,'2020-12-16 11:37:30',1,NULL,NULL,NULL,0,1),(150,14,69,31,1,0,1,'2020-12-16 11:37:41',1,NULL,NULL,NULL,0,1),(151,1,70,9,1,0,1,'2020-12-16 11:38:31',1,NULL,NULL,NULL,0,1),(152,1,70,8,1,0,1,'2020-12-16 11:38:31',1,NULL,NULL,NULL,0,1),(153,1,70,4,1,0,1,'2020-12-16 11:38:31',1,NULL,NULL,NULL,0,1),(154,8,71,10,1,0,1,'2020-12-16 11:39:14',1,NULL,NULL,NULL,0,1),(155,8,71,31,1,0,1,'2020-12-16 11:39:14',1,NULL,NULL,NULL,0,1),(156,8,71,1,1,0,1,'2020-12-16 11:39:14',1,NULL,NULL,NULL,0,1);
/*!40000 ALTER TABLE `rented_book_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `volunteer`
--

DROP TABLE IF EXISTS `volunteer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
 SET character_set_client = utf8mb4 ;
CREATE TABLE `volunteer` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `phone` varchar(21) COLLATE utf8_unicode_ci DEFAULT NULL,
  `email` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `linkFacebook` varchar(100) COLLATE utf8_unicode_ci DEFAULT NULL,
  `address` varchar(200) COLLATE utf8_unicode_ci DEFAULT NULL,
  `dob` datetime DEFAULT NULL,
  `reasons` text COLLATE utf8_unicode_ci,
  `contributes` text COLLATE utf8_unicode_ci,
  `status` int(11) DEFAULT NULL,
  `note` varchar(500) COLLATE utf8_unicode_ci DEFAULT NULL,
  `createdDate` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedDate` datetime DEFAULT NULL,
  `updatedMemberId` int(11) DEFAULT NULL,
  `isActive` int(11) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`),
  KEY `updatedMemberId` (`updatedMemberId`),
  CONSTRAINT `volunteer_ibfk_1` FOREIGN KEY (`updatedMemberId`) REFERENCES `member` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `volunteer`
--

LOCK TABLES `volunteer` WRITE;
/*!40000 ALTER TABLE `volunteer` DISABLE KEYS */;
INSERT INTO `volunteer` VALUES (1,'Lê Hoàng Anh','0933489120','anhlh@ftu.edu.vn','fb.com/hoanganh','21 Chùa Láng, Hà Nội','2001-09-16 00:00:00','Vì thấy Thư viện trên VTV nên tham gia thử hihi','Đóng góp cả tuổi thanh xuân cho Thư viện',2,'Bạn này ở xa quá nên sẽ không thể hoạt động cùng Thư viện được','2020-09-16 23:01:27','2020-09-17 00:17:02',1,1),(2,'Nguyễn Thanh Huyền','0335124998','huyennt98@gmail.com','fb.com/huyen98','Đức Thượng, Hoài Đức','1998-09-16 00:00:00','Em muốn vào Thư viện vì có nhiều bạn nam đẹp trai','Em có thể trông Thư viện mỗi cuối tuần',0,NULL,'2020-09-16 23:04:32',NULL,NULL,1),(3,'Phi Linh','0986331267','linh_xinh@gmail.com','fb.com/linhlinh','Xóm Quê','2002-10-30 00:00:00','Lý do vào Thư viện để gặp anh Vinh đẹp trai dã man <3','Tham gia các hoạt động, sự kiện Thư viện tổ chức',0,NULL,'2020-09-16 23:06:20',NULL,NULL,1),(4,'Nguyễn Trường Thăng','0973545408','thangmt3@gmail.com','fb.com/ocnhoimatloi','Đội 5 Cát Quế','2005-06-03 00:00:00','Muốn đóng góp xây dựng văn hóa đọc tới mọi người dân ở quê mình','Trông thư viện, tham gia dự án, đóng góp ý tưởng',0,NULL,'2020-09-16 23:10:01',NULL,NULL,1),(5,'Trần Thị Ninh','0966456123','ninhtran@gmail.com','fb.com/ninhtran','Đội 11, Dương Liễu','1998-08-17 00:00:00','Ở nhà chán quá nên muốn tham gia thư viện ạ','Cái này em cũng chưa nghĩ ra =)))',1,NULL,'2020-09-16 23:12:20','2020-10-07 22:28:44',5,1);
/*!40000 ALTER TABLE `volunteer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'duonglieu_library_test'
--
/*!50106 SET @save_time_zone= @@TIME_ZONE */ ;
/*!50106 DROP EVENT IF EXISTS `event_update_outOfDate` */;
DELIMITER ;;
/*!50003 SET @saved_cs_client      = @@character_set_client */ ;;
/*!50003 SET @saved_cs_results     = @@character_set_results */ ;;
/*!50003 SET @saved_col_connection = @@collation_connection */ ;;
/*!50003 SET character_set_client  = utf8mb4 */ ;;
/*!50003 SET character_set_results = utf8mb4 */ ;;
/*!50003 SET collation_connection  = utf8mb4_general_ci */ ;;
/*!50003 SET @saved_sql_mode       = @@sql_mode */ ;;
/*!50003 SET sql_mode              = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER,NO_ENGINE_SUBSTITUTION' */ ;;
/*!50003 SET @saved_time_zone      = @@time_zone */ ;;
/*!50003 SET time_zone             = 'SYSTEM' */ ;;
/*!50106 CREATE*/ /*!50117 DEFINER=`vinhnk`@`%`*/ /*!50106 EVENT `event_update_outOfDate` ON SCHEDULE EVERY 1 DAY STARTS '2020-09-11 00:01:00' ON COMPLETION NOT PRESERVE ENABLE DO UPDATE rented_book_detail SET outOfDate = TIMESTAMPDIFF(DAY, DATE(borrowedDate), DATE(NOW())) - 7
WHERE TIMESTAMPDIFF(DAY, DATE(borrowedDate), DATE(NOW())) > 7 AND returnedDate IS NULL AND status = 1 AND isActive = 1 */ ;;
/*!50003 SET time_zone             = @saved_time_zone */ ;;
/*!50003 SET sql_mode              = @saved_sql_mode */ ;;
/*!50003 SET character_set_client  = @saved_cs_client */ ;;
/*!50003 SET character_set_results = @saved_cs_results */ ;;
/*!50003 SET collation_connection  = @saved_col_connection */ ;;
DELIMITER ;
/*!50106 SET TIME_ZONE= @save_time_zone */ ;

--
-- Dumping routines for database 'duonglieu_library_test'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-12-16 21:43:41
