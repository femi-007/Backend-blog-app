const Employee = require('../model/Employee');
const User = require('../model/User');
const ROLES_LIST = require('../config/roles_list');

async function grantUserRole(res, role, email) {
    const foundUser = await User.findOne({ email }).exec();
    if (!foundUser) return res.status(400).json({ 'message': 'Ensure the employee has already created a user account'});

    if (role === 'Author') {
        foundUser.roles.Author = ROLES_LIST[role];
        await foundUser.save();
    } else if (role === 'Editor') {
        foundUser.roles.Editor = ROLES_LIST[role];
        await foundUser.save();
    }
}

const getAllEmployees = async (req, res) => {
    const employees = await Employee.find();
    if (!employees) return res.status(204).json({ 'message': 'No employees found.'})
    res.json(employees);
}

const createNewEmployees = async (req, res) => {
    if (!req?.body?.firstname || !req?.body?.lastname || !req?.body?.email || !req?.body?.position) {
        return res.status(400).json({ 'message': 'The followiing fiellds are required: firstname, lastname, email, position' })
    }
    
    // Grant some users who are employees premission based on position
    if (req.body.position) {
        const statusMessage = await grantUserRole(res, req.body.position, req.body.email)
        if (statusMessage) return statusMessage;
    }

    try {
        const result = await Employee.create({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            position: req.body.position
        });

        res.status(201).json(result);

    } catch (err) {
        console.error(err);
    }
}

const updateEmployees = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({ 'message': 'Employee ID required.' })
    }

    const employee = await Employee.findOne({ _id: req.params.id }).exec();
    if(!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.params.id}` }); 
    }

    if (req.body?.position) {
        const statusMessage = await grantUserRole(res, req.body.position, employee.email)
        if (statusMessage) return statusMessage;
    }

    if (req.body?.firstname) employee.firstname = req.body.firstname;
    if (req.body?.lastname) employee.lastname = req.body.lastname;
    if (req.body?.email) employee.email = req.body.email;

    const result = await employee.save();
    res.json(result);
}

const deleteEmployees = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'Employee ID required.' })

    const employee = await Employee.findOne({ _id: req.params.id }).exec();
    if(!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.params.id}` }); 
    }
    const result = await employee.deleteOne({ _id: req.body.id });
    res.json(result);
}

const getEmployee = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ 'message': 'ID parameter required.' })

    const employee = await Employee.findOne({ _id: req.params.id }).exec();
    if(!employee) {
        return res.status(400).json({ "message": `Employee ID ${req.params.id} not found` }); 
    }
    res.json(employee);
}

module.exports = { getAllEmployees, createNewEmployees, updateEmployees, deleteEmployees, getEmployee }