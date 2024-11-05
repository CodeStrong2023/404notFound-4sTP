-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: ecommerce
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `carrito`
--

DROP TABLE IF EXISTS `carrito`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carrito` (
  `id_carrito` int NOT NULL AUTO_INCREMENT,
  `id_cliente` int DEFAULT NULL,
  `id_producto` int DEFAULT NULL,
  `cantidad` int NOT NULL,
  `fecha_agregado` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_carrito`),
  KEY `id_cliente` (`id_cliente`),
  KEY `id_producto` (`id_producto`),
  CONSTRAINT `carrito_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id_cliente`),
  CONSTRAINT `carrito_ibfk_2` FOREIGN KEY (`id_producto`) REFERENCES `productos` (`id_producto`)
) ENGINE=InnoDB AUTO_INCREMENT=116 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `clientes`
--

DROP TABLE IF EXISTS `clientes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `clientes` (
  `id_cliente` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(50) NOT NULL,
  `apellido` varchar(50) NOT NULL,
  `direccion` varchar(100) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `contrasena` varchar(255) NOT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `fecha_registro` datetime DEFAULT CURRENT_TIMESTAMP,
  `rol` enum('cliente','administrador') NOT NULL DEFAULT 'cliente',
  `estado_logueo` tinyint(1) NOT NULL DEFAULT '0',
  `carrito` json DEFAULT NULL,
  PRIMARY KEY (`id_cliente`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table metodos_pago
--

DROP TABLE IF EXISTS metodos_pago;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE metodos_pago (
  id_metodo_pago int NOT NULL AUTO_INCREMENT,
  id_cliente int NOT NULL,
  tipo varchar(50) NOT NULL,
  nombre_titular varchar(100) NOT NULL,
  numero_tarjeta varchar(255) NOT NULL,
  fecha_expiracion date NOT NULL,
  cvv varchar(4) NOT NULL,
  fecha_registro datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id_metodo_pago),
  KEY fk_metodos_pago_cliente_idx (id_cliente),
  CONSTRAINT fk_metodos_pago_cliente FOREIGN KEY (id_cliente) REFERENCES clientes (id_cliente)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table pedidos
--

DROP TABLE IF EXISTS pedidos;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE pedidos (
  id_pedido int NOT NULL AUTO_INCREMENT,
  id_cliente int DEFAULT NULL,
  fecha_pedido datetime DEFAULT CURRENT_TIMESTAMP,
  total decimal(10,2) DEFAULT NULL,
  estado enum('pendiente','procesado','enviado','entregado','cancelado') DEFAULT 'pendiente',
  PRIMARY KEY (id_pedido),
  KEY idx_pedido_cliente (id_cliente),
  CONSTRAINT pedidos_ibfk_1 FOREIGN KEY (id_cliente) REFERENCES clientes (id_cliente)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table productos
--

DROP TABLE IF EXISTS productos;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE productos (
  id_producto int NOT NULL AUTO_INCREMENT,
  nombre varchar(100) NOT NULL,
  descripcion text,
  precio decimal(10,2) NOT NULL,
  stock int NOT NULL,
  foto varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  fecha_creacion datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  precio_comparacion decimal(10,2) DEFAULT NULL,
  categoria varchar(255) DEFAULT NULL,
  PRIMARY KEY (id_producto)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'ecommerce'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

INSERT INTO ecommerce.productos (nombre, descripcion, precio, stock, foto, precio_comparacion, categoria) VALUES
('Vino Blanco Dulce - Marló Bianchi', 'VINO BLANCO', 12.50, 30, 'https://i.ibb.co/dmC1cNX/0553f4f9-409e-4450-bcc6-a39408894706.jpg', 15.00, 'vino-blanco'),
('Vino Blanco Dulce - Tardío Desdén', 'VINO DULCE', 11.50, 35, 'https://i.ibb.co/qdt5ctx/Whats-App-Image-2024-09-27-at-21-36-37.jpg', 16.00, 'vino-blanco'),
('Vino Tinto Cabernet - Suavignon Argana', 'CABERNET', 12.30, 25, 'https://i.ibb.co/2Mqq911/Whats-App-Image-2024-09-27-at-21-36-37-3.jpg', 14.90, 'vino-tinto'),
('Vino Tinto - Espacio Malbec Bodega Rubio', 'MALBEC', 10.50, 15, 'https://i.ibb.co/bHBPZSZ/Whats-App-Image-2024-09-27-at-21-36-38.jpg', 13.10, 'vino-tinto'),
('Vino Tinto Eugenio Bustos Malbec Bodega La Celia', 'EUGENIO', 8.00, 20, 'https://i.ibb.co/8YZngQq/Whats-App-Image-2024-09-27-at-21-38-37.jpg', 11.00, 'vino-tinto');

-- Dump completed on 2024-10-25 22:43:29