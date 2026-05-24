/**
 * Fake auth service to simulate async API calls.
 * Replace with real backend calls later (e.g., using fetch).
 */
export const authService = {
  login: async (email, password) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (email === "parent@school.com" && password === "password") {
          resolve({ user: { id: "p1", name: "Parent User", role: "Parent" }, token: "fake-jwt-token" });
        } else if (email === "student@school.com" && password === "password") {
          resolve({ user: { id: "s1", name: "Rahul Kumar", role: "Student" }, token: "fake-jwt-token" });
        } else if (email === "admin@school.com" && password === "password") {
          resolve({ user: { id: "a1", name: "Neranjan", role: "Admin" }, token: "fake-jwt-token" });
        } else if (email === "teacher@school.com" && password === "password") {
          resolve({ user: { id: "t1", name: "Priya Sharma", role: "Teacher" }, token: "fake-jwt-token" });
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 800);
    });
  },

  logout: async () => {
    return new Promise((resolve) => setTimeout(resolve, 300));
  }
};
