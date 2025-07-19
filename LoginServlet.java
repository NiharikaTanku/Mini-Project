import java.io.*;
import java.sql.*;
import javax.servlet.*;
import javax.servlet.http.*;

public class LoginServlet extends HttpServlet {

    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        
        response.setContentType("text/html");
        PrintWriter out = response.getWriter();

        String username = request.getParameter("username");
        String password = request.getParameter("password");
        out.println("Username: " + username);
out.println("Password: " + password);


        try {
            // Load Oracle driver
            Class.forName("oracle.jdbc.driver.OracleDriver");

            // Connect to Oracle DB
            Connection conn = DriverManager.getConnection(
                "jdbc:oracle:thin:@localhost:1521:xe",  // Change host/service name if needed
                "niharika",                      // <-- replace this
                "niha"                       // <-- replace this
            );
            

// Now it's safe to trim
username = username.trim();
password = password.trim();
            String sql = "SELECT * FROM users WHERE LOWER(username) = LOWER(?) AND password = ?";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1,username);
            stmt.setString(2, password);

            ResultSet rs = stmt.executeQuery();

            if (rs.next()) {
    HttpSession session = request.getSession();

    String actualUsername = null;

    try {
        actualUsername = rs.getString("username"); // or "USERNAME" based on DESC users;
    } catch (SQLException e) {
        e.printStackTrace();
    }

    if (actualUsername == null) {
        actualUsername = username;
    }

    session.setAttribute("username", actualUsername);
    response.sendRedirect("home.html");
} else {
    out.println("<script>alert('Invalid username or password.'); history.back();</script>");
}

            conn.close();

        } catch (Exception e) {
            e.printStackTrace(out);  // Shows full error for debugging
        }
        System.out.println("username param: " + request.getParameter("username"));
System.out.println("password param: " + request.getParameter("password"));

    }
}
