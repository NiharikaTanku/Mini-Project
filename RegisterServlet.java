import java.io.*;
import java.sql.*;
import javax.servlet.*;
import javax.servlet.http.*;

public class RegisterServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        String username = request.getParameter("username");
        String password = request.getParameter("password");

        try {
            // Load Oracle JDBC Driver
            Class.forName("oracle.jdbc.driver.OracleDriver");

            // Establish connection
            Connection conn = DriverManager.getConnection(
                "jdbc:oracle:thin:@localhost:1521:xe", // Update host/service if needed
                "niharika",                    // <-- replace with your username
                "niha"                     // <-- replace with your password
            );

            // Check if username already exists
            PreparedStatement checkStmt = conn.prepareStatement(
                "SELECT COUNT(*) FROM users WHERE username = ?"
            );
            checkStmt.setString(1, username);
            ResultSet rs = checkStmt.executeQuery();
            rs.next();

            if (rs.getInt(1) > 0) {
                out.println("<h3 style='color:red;'>Username already exists!</h3>");
                out.println("<a href='register.html'>Try Again</a>");
            } else {
                // Insert new user (id is auto-generated via trigger)
                PreparedStatement insertStmt = conn.prepareStatement(
                    "INSERT INTO users (username, password) VALUES (?, ?)"
                );
                insertStmt.setString(1, username);
                insertStmt.setString(2, password);
                insertStmt.executeUpdate();

                out.println("<h3>Registration successful!</h3>");
                out.println("<a href='login.html'>Click here to login</a>");
            }

            conn.close();

        } catch (Exception e) {
            e.printStackTrace(out);  // Print detailed error on page for debugging
        }
    }
}
