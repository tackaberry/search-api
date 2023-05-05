import request from 'supertest'
import app from '../../app'
import OpensearchService from '../../src/services/os.service'

jest.mock('../../src/services/os.service')

describe('Search Route', () => {
  test('/domains returns successfully', async () => {s

    OpensearchService.mockImplementation(() => {
      return {
        getDomains: jest
          .fn()
          .mockResolvedValue([{ content: "somethign" }]),
      }
    })
    const response = await request(app)
      .get('/search/')
      .set('Origin', 'domain.com')

    expect(response.status).toEqual(200)
    expect(response.body).toEqual({
      success: true,
      results: [{ content: "somethign" }],
    })
  })
})
