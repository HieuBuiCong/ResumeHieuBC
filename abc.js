      {/* Render AnswerModal when Open */}
      {isTaskTable && selectedItem && (
        <AnswerModal
          open={answerModalOpen}
          onClose={() => setAnswerModalOpen(false)}
          task={selectedItem}
        />
      )}
