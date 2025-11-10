export const getNotes = /* GraphQL */ `
  query GetNotes($sentiment: Sentiment, $limit: Int, $nextToken: String) {
    getNotes(sentiment: $sentiment, limit: $limit, nextToken: $nextToken) {
      items {
        id
        text
        sentiment
        dateCreated
      }
      nextToken
      scannedCount
    }
  }
`;

export const createNote = /* GraphQL */ `
  mutation CreateNote($text: String!, $sentiment: Sentiment!) {
    createNote(text: $text, sentiment: $sentiment) {
      id
      text
      sentiment
      dateCreated
    }
  }
`;

export const updateNote = /* GraphQL */ `
  mutation UpdateNote($id: ID!, $dateCreated: AWSDateTime!, $text: String!, $sentiment: Sentiment!) {
    updateNote(id: $id, dateCreated: $dateCreated, text: $text, sentiment: $sentiment) {
      id
      text
      sentiment
      dateCreated
    }
  }
`;

export const deleteNote = /* GraphQL */ `
  mutation DeleteNote($id: ID!, $dateCreated: AWSDateTime!) {
    deleteNote(id: $id, dateCreated: $dateCreated) {
      id
    }
  }
`;