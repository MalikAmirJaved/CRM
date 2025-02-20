import React, { useEffect, useState } from "react";
import axios from "axios";

const PanelProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [search, setSearch] = useState("");
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [newProject, setNewProject] = useState({
    project_Name: "",
    project_Department: "",
  });
  const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    employee_Name: "",
    employee_Email: "",
    employee_Role: "",
  });
  const [departments, setDepartments] = useState([]); // Departments state

  // Fetch projects data from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const jwtLoginToken = localStorage.getItem("jwtLoginToken");
        const response = await axios.get("http://localhost:3000/project/admin/projects", {
          headers: {
            Authorization: `Bearer ${jwtLoginToken}`,
          },
        });
        const projectData = response.data?.information?.projects || [];
        setProjects(projectData);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Fetch departments when creating a new project
  useEffect(() => {
    if (showNewProjectForm) {
      const fetchDepartments = async () => {
        try {
          const jwtLoginToken = localStorage.getItem("jwtLoginToken");
          const response = await axios.get("http://localhost:3000/department/get-departments", {
            headers: {
              Authorization: `Bearer ${jwtLoginToken}`,
            },
          });
          const departmentData = response.data?.information?.departments || [];
          setDepartments(departmentData);
        } catch (err) {
          console.error("Error fetching departments:", err);
          setDepartments([]);
        }
      };
      fetchDepartments();
    }
  }, [showNewProjectForm]);

  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  };

  const handleCloseDetails = () => {
    setSelectedProject(null);
    document.body.style.overflow = "auto"; // Re-enable background scrolling
  };

  const handleNewProjectChange = (event) => {
    const { name, value } = event.target;
    setNewProject({ ...newProject, [name]: value });
  };

  const handleNewProjectSubmit = async (event) => {
    event.preventDefault();
    if (!newProject.project_Name || !newProject.project_Department) {
      alert("Both fields are required!");
      return;
    }

    try {
      const jwtLoginToken = localStorage.getItem("jwtLoginToken");
      const response = await axios.post("http://localhost:3000/project/admin/add-project", newProject, {
        headers: {
          Authorization: `Bearer ${jwtLoginToken}`,
        },
      });

      const addedProject = response.data?.project || {
        ...newProject,
        progress: 0,
      };

      setProjects((prevProjects) => [...prevProjects, addedProject]);
      setNewProject({ project_Name: "", project_Department: "" });
      setShowNewProjectForm(false);
    } catch (error) {
      console.error("Error creating project:", error);
      alert("Failed to create project. Please try again.");
    }
  };

  const handleAddEmployeeChange = (event) => {
    const { name, value } = event.target;
    setNewEmployee({ ...newEmployee, [name]: value });
  };

  const handleAddEmployeeSubmit = async (event) => {
    event.preventDefault();

    if (!selectedProject || !selectedProject.project_Name) {
      alert("No project selected. Please try again.");
      return;
    }

    if (!newEmployee.employee_Name || !newEmployee.employee_Email || !newEmployee.employee_Role) {
      alert("All fields are required!");
      return;
    }

    try {
      const jwtLoginToken = localStorage.getItem("jwtLoginToken");
      const response = await axios.post(
        "http://localhost:3000/project/add-employee-to-project",
        {
          project_Name: selectedProject.project_Name,
          employee_Name: newEmployee.employee_Name,
          employee_Email: newEmployee.employee_Email,
          employee_Role: newEmployee.employee_Role,
        },
        {
          headers: {
            Authorization: `Bearer ${jwtLoginToken}`,
          },
        }
      );

      const updatedProject = response.data?.information?.project;

      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project.project_Name === updatedProject.project_Name ? updatedProject : project
        )
      );

      setSelectedProject(updatedProject);

      setNewEmployee({
        employee_Name: "",
        employee_Email: "",
        employee_Role: "",
      });
      setShowAddEmployeeForm(false);

      alert("Employee added successfully!");
    } catch (error) {
      console.error("Error adding employee:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Failed to add employee.");
    }
  };

  // Filtered Projects
  const filteredProjects = projects.filter((project) =>
    project.project_Name?.toLowerCase().includes(search.toLowerCase())
  );

  // Stats Calculation
  const totalProjects = projects.length;
  const completedProjects = projects.filter((project) => project.status === "completed").length;
  const inProgressProjects = projects.filter((project) => project.status === "in-progress").length;

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-xl font-semibold text-gray-600 animate-pulse">
          Fetching projects... Please wait.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 flex justify-center items-center min-h-screen bg-gray-100">
        <p className="text-xl font-semibold text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-100 via-white to-gray-100">
      <div className="p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-5xl font-extrabold text-blue-800 tracking-wide drop-shadow-md">
            Projects Dashboard
          </h1>
          <button
            onClick={() => setShowNewProjectForm(true)}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            + New Project
          </button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white shadow-md hover:shadow-lg transition-all rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-700">Total Projects</h2>
            <p className="text-5xl font-extrabold text-blue-600 mt-3">{totalProjects}</p>
          </div>
          <div className="bg-white shadow-md hover:shadow-lg transition-all rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-700">Completed Projects</h2>
            <p className="text-5xl font-extrabold text-green-500 mt-3">{completedProjects}</p>
          </div>
          <div className="bg-white shadow-md hover:shadow-lg transition-all rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-700">In Progress</h2>
            <p className="text-5xl font-extrabold text-yellow-500 mt-3">{inProgressProjects}</p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white shadow-md rounded-lg p-4 mb-8">
          <input
            type="text"
            placeholder="🔍 Search for projects..."
            value={search}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Project List */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project._id}
                className="bg-gradient-to-br from-white to-gray-100 shadow-lg hover:shadow-2xl rounded-lg p-6 cursor-pointer transition-all transform hover:scale-105"
                onClick={() => handleProjectClick(project)}
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-2">{project.project_Name}</h2>
                <p className="text-lg text-gray-600 mb-1">
                  📂 Department: <span className="font-semibold">{project.project_Department || "N/A"}</span>
                </p>
                <p className="text-lg text-gray-600 mb-1">
                  👥 Employees: <span className="font-semibold">{project.project_Employees?.length || 0}</span>
                </p>
                <p className="text-lg text-gray-600 mb-3">
                  Status: <span className="font-semibold">{project.status}</span>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xl text-gray-600">No projects found.</p>
        )}

        {/* Add New Project Form */}
        {showNewProjectForm && (
          <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Create New Project</h2>
              <form onSubmit={handleNewProjectSubmit}>
                <div className="mb-4">
                  <label htmlFor="project_Name" className="block text-gray-700 font-semibold">Project Name</label>
                  <input
                    type="text"
                    id="project_Name"
                    name="project_Name"
                    value={newProject.project_Name}
                    onChange={handleNewProjectChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="project_Department" className="block text-gray-700 font-semibold">Department</label>
                  <select
                    id="project_Department"
                    name="project_Department"
                    value={newProject.project_Department}
                    onChange={handleNewProjectChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    required
                  >
                    <option value="">Select a Department</option>
                    {departments.map((dept) => (
                      <option key={dept.department_Name} value={dept.department_Name}>
                        {dept.department_Name}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Create Project
                </button>
              </form>

              <button
                onClick={() => setShowNewProjectForm(false)}
                className="mt-4 w-full py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PanelProjects;
