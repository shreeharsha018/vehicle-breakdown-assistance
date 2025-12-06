# Contributing Guidelines

Thank you for your interest in contributing to Vehicle Breakdown Assistance Platform! Please read this guide to understand how to contribute effectively.

## Code of Conduct

- Be respectful and professional
- Provide constructive feedback
- Help others learn and grow
- Report issues responsibly

## Getting Started

1. **Fork the repository**
```bash
git clone https://github.com/shreeharsha018/vehicle-breakdown-assistance.git
cd vehicle-breakdown-assistance
```

2. **Create a feature branch**
```bash
git checkout -b feature/your-feature-name
```

3. **Setup development environment**
```bash
npm install
npm run dev
```

4. **Make your changes**

5. **Test your changes**
```bash
npm test -w backend
npm run lint
```

6. **Commit with descriptive messages**
```bash
git commit -m "feat: Add new feature description"
```

7. **Push and create Pull Request**
```bash
git push origin feature/your-feature-name
```

## Commit Message Format

Follow conventional commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting, linting
- `refactor` - Code refactoring
- `perf` - Performance improvement
- `test` - Tests
- `chore` - Maintenance

### Examples
```
feat(auth): Add JWT token refresh endpoint
fix(booking): Prevent duplicate bookings
docs: Add API documentation
```

## Pull Request Process

1. **Create descriptive PR title**
   - Bad: "Updates"
   - Good: "feat: Add real-time booking status updates"

2. **Add detailed PR description**
   ```markdown
   ## Description
   Fixes issue #123
   
   ## Changes
   - Added new API endpoint
   - Updated database schema
   - Added unit tests
   
   ## Testing
   Manual testing completed on local environment
   
   ## Screenshots
   [if applicable]
   ```

3. **Ensure all checks pass**
   - ✅ Tests passing
   - ✅ Linting successful
   - ✅ No breaking changes

4. **Request review from maintainers**

5. **Address review feedback**

6. **Squash commits before merge**
   ```bash
   git rebase -i origin/main
   ```

## Development Standards

### Code Style
- Use ESLint configuration provided
- Format code with Prettier
- Follow DRY principle
- Maximum line length: 100 characters

### JavaScript
```javascript
// ✅ Good
const getBookingStatus = (bookingId) => {
  return bookings.find(b => b.id === bookingId)?.status;
};

// ❌ Bad
function getBookingStatus(bid){
  for(let i=0;i<bookings.length;i++){
    if(bookings[i].id==bid)return bookings[i].status;
  }
}
```

### Comments
```javascript
// ✅ Good - Explains why
// Cache services for 1 hour to reduce database load
const CACHE_DURATION = 3600000;

// ❌ Bad - Obvious
// Get the service
const service = Service.findById(id);
```

### Error Handling
```javascript
// ✅ Good
try {
  const booking = await Booking.findById(id);
  if (!booking) {
    return res.status(404).json({ message: 'Booking not found' });
  }
} catch (error) {
  next(error); // Pass to error handler
}

// ❌ Bad
const booking = await Booking.findById(id);
res.json(booking); // Could send null
```

### API Routes
```javascript
// ✅ Good - Consistent, RESTful
GET    /api/bookings           - List all
POST   /api/bookings           - Create
GET    /api/bookings/:id       - Get one
PUT    /api/bookings/:id       - Update
DELETE /api/bookings/:id       - Delete

// ❌ Bad - Inconsistent naming
GET    /api/get_all_bookings
POST   /api/add_booking
GET    /api/fetch?id=123
```

## Testing Guidelines

### Backend Tests
```bash
# Run all tests
npm test -w backend

# Run specific test file
npm test -w backend -- bookings.test.js

# With coverage
npm test -w backend -- --coverage
```

### Test Structure
```javascript
describe('Bookings', () => {
  describe('Create', () => {
    it('should create booking with valid data', () => {
      // Arrange
      const bookingData = { serviceId: '...', problem: '...' };
      
      // Act
      const result = createBooking(bookingData);
      
      // Assert
      expect(result.id).toBeDefined();
      expect(result.status).toBe('pending');
    });

    it('should reject booking without problem', () => {
      const invalidData = { serviceId: '...' };
      expect(() => createBooking(invalidData)).toThrow();
    });
  });
});
```

### Coverage Requirements
- Minimum 80% line coverage
- All critical paths tested
- Error cases covered

## Documentation

### README Format
- Clear project description
- Setup instructions
- API overview
- Contributing section

### Code Documentation
```javascript
/**
 * Calculate total booking cost including taxes
 * @param {number} basePrice - Base service price
 * @param {number} additionalCharges - Extra charges
 * @param {number} taxRate - Tax percentage (e.g., 10 for 10%)
 * @returns {number} Total cost with taxes
 * @throws {Error} If parameters are invalid
 */
function calculateTotalCost(basePrice, additionalCharges, taxRate) {
  // Implementation
}
```

## Performance Guidelines

### Database
- Always index frequently queried fields
- Avoid N+1 queries (use populate/join)
- Limit query results when possible
- Use projection to select specific fields

```javascript
// ✅ Good - Only fetch needed fields
const bookings = await Booking.find()
  .select('id status userId')
  .limit(20)
  .populate('userId', 'name email');

// ❌ Bad - Fetches all data
const bookings = await Booking.find();
```

### API Responses
- Return only necessary data
- Use pagination for lists
- Implement caching for frequently accessed data

### Frontend
- Lazy load images
- Minimize CSS/JS
- Avoid blocking operations
- Use async/await for API calls

## Security Guidelines

### Never Commit
- `.env` files with secrets
- API keys
- Passwords
- Private credentials

### Always Verify
- Input validation on all endpoints
- SQL injection prevention
- XSS protection
- CSRF tokens for state-changing operations

```javascript
// ✅ Good - Validate input
router.post('/bookings', [
  body('problem').trim().notEmpty().withMessage('Problem is required'),
  body('serviceId').isMongoId().withMessage('Invalid service ID'),
], createBooking);

// ❌ Bad - No validation
router.post('/bookings', createBooking);
```

## Debugging Tips

### Backend
```bash
# Debug with Node inspector
node --inspect-brk server.js

# Check logs
npm run dev -w backend 2>&1 | tee debug.log

# Test with curl
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"pass"}'
```

### Frontend
```javascript
// Use console for debugging
console.log('Booking data:', bookingData);
console.table(bookings);
console.error('Error occurred:', error);

// Network tab in DevTools
// Storage tab for localStorage
```

## Common Issues

### Issue: Port already in use
```bash
# Kill process using port
lsof -i :5000
kill -9 PID

# Or use different port
PORT=5001 npm run dev -w backend
```

### Issue: MongoDB connection fails
```bash
# Check MongoDB is running
ps aux | grep mongod

# Check connection string in .env
# Verify credentials if using Atlas
```

### Issue: Tests failing
```bash
# Clear test database
npm test -w backend -- --clearCache

# Run single test
npm test -w backend -- --testNamePattern="specific test"
```

## Resources

- [Git Documentation](https://git-scm.com/doc)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Express Guidelines](https://expressjs.com/en/advanced/best-practice-performance.html)
- [MongoDB Best Practices](https://docs.mongodb.com/manual/administration/best-practices/)
- [JavaScript Style Guide](https://google.github.io/styleguide/javascriptguide.html)

## Getting Help

- Ask in GitHub Discussions
- Comment on relevant issues
- Reach out to maintainers
- Check existing documentation

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md
- Release notes
- Commit history
- GitHub contributors page

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing! 🎉