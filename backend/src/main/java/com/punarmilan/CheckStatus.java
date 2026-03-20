package com.punarmilan;

import java.sql.*;

public class CheckStatus {
    public static void main(String[] args) {
        String url = "jdbc:mysql://localhost:3306/punarmilan_db";
        String user = "root";
        String password = System.getenv("DB_PASSWORD");
        if (password == null) password = "";

        try (Connection conn = DriverManager.getConnection(url, user, password)) {
            System.out.println("Connection successful!");
            String query = "SELECT verification_status, COUNT(*) FROM profiles GROUP BY verification_status";
            try (Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(query)) {
                while (rs.next()) {
                    System.out.println("Status: " + rs.getString(1) + ", Count: " + rs.getInt(2));
                }
            }
            
            String queryPhotos = "SELECT photo_verification_status, COUNT(*) FROM profiles GROUP BY photo_verification_status";
            try (Statement stmt = conn.createStatement(); ResultSet rs = stmt.executeQuery(queryPhotos)) {
                while (rs.next()) {
                    System.out.println("Photo Status: " + rs.getString(1) + ", Count: " + rs.getInt(2));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
