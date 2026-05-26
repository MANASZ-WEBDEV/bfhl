const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/ticketController');
const {
  createTicketRules,
  updateTicketRules,
  deleteTicketRules,
  listTicketRules,
} = require('../validators/ticketValidator');

// Stats route MUST come before /:id to avoid "stats" being parsed as an ID
router.get('/stats', ctrl.getStats);

router.post('/',    createTicketRules, ctrl.createTicket);
router.get('/',     listTicketRules,   ctrl.listTickets);
router.patch('/:id', updateTicketRules, ctrl.updateTicket);
router.delete('/:id', deleteTicketRules, ctrl.deleteTicket);

module.exports = router;
