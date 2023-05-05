import { OpensearchService } from '../../src/services'

beforeAll(() => jest.clearAllMocks())

describe('Search Service', () => {
  test('Search', async () => {
    const service = new OpensearchService()
    service.search = jest.fn().mockImplementation((_, params) => params)

    expect(await service.search('word')).toEqual([
      {
        results: ['word'],
      },
    ])
  })
})
