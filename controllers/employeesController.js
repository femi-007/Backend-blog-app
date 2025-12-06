const Employee = require('../model/Employee');
const User = require('../model/User');
const ROLES_LIST = require('../config/roles_list');
const { employeeSchema } = require('../utils/validations/resourceValidation');
const { formatValidationError } = require('../utils/format');

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
    // filter employees
    const filter = {};

    if (req.query.firstname) filter.firstname = req.query.firstname;
    if (req.query.lastname) filter.lastname = req.query.lastname;
    if (req.query.position) filter.position = req.query.position;

    const employees = await Employee.find(filter);
    if (!employees) return res.status(204).json({ 'message': 'No employees found.'})
    res.json(employees);
}

const createNewEmployees = async (req, res) => {
    // validate input
    const validationResult = employeeSchema.safeParse(req.body);

    if (!validationResult.success) {
        return res.status(400).json({
            error: 'validation error',
            details: formatValidationError(validationResult.error)
        })
    }

    const { firstname, lastname, email, position } = validationResult.data;
    
    // Grant some users who are employees premission based on position
    if (position) {
        const statusMessage = await grantUserRole(res, position, email)
        if (statusMessage) return statusMessage;
    }

    // create employee
    try {
        const result = await Employee.create({
            firstname,
            lastname,
            email,
            position
        });

        res.status(201).json(result);

    } catch (err) {
        console.error(err);
    }
}

const updateEmployees = async (req, res) => {
    // validate input
    if (!req?.params?.id) {
        return res.status(400).json({ 'message': 'Employee ID required.' })
    }

    const updateEmployeeSchema = employeeSchema.partial();
    const validationResult = updateEmployeeSchema.safeParse(req.body);

    if (!validationResult.success) {
        return res.status(400).json({
            error: 'validation error',
            details: formatValidationError(validationResult.error)
        })
    }

    const { firstname, lastname, email, position } = validationResult.data;

    // check if employee exists
    const employee = await Employee.findOne({ _id: req.params.id }).exec();
    if(!employee) {
        return res.status(204).json({ "message": `No employee matches ID ${req.params.id}` }); 
    }

    // update employee field(s)
    if (position) {
        const statusMessage = await grantUserRole(res, position, employee.email)
        if (statusMessage) return statusMessage;
    }

    if (firstname) employee.firstname = firstname;
    if (lastname) employee.lastname = lastname;
    if (email) employee.email = email;

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