import React, { useState } from 'react';
import {
  Avatar,
  AvatarGroup,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Tooltip,
  useDisclosure,
} from '@nextui-org/react';
import { getInitialLetters } from '../../shared/utils.tsx';
import { VerticalDotsIcon } from '../../icons/VerticalDotsIcon.tsx';
import { Match } from '../../models/Match.ts';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CreateEditMatchDialog from './Dialog/CreateEditMatchDialog.component.tsx';
import AlertDialog from '../AlertDialog.component.tsx';
import { ApiEndpoint } from '../../models/constants.ts';
import useFetch from '../../hooks/useFetch.tsx';
import { useToast } from '../../context/Toast.context.tsx';

interface IMatchCardProps {
  match: Match;
  getAllMatches: () => Promise<Match[]>;
}

function MatchCard({ match, getAllMatches }: IMatchCardProps) {
  const [selectedMatch, setSelectedMatch] = useState<Match | undefined>();
  const {
    isOpen: isOpenEditMatchDialog,
    onOpen: onOpenEditMatchDialog,
    onOpenChange: onOpenChangeEditMatchDialog,
  } = useDisclosure();
  const {
    isOpen: isOpenEndMatchDialog,
    onOpen: onOpenEndMatchDialog,
    onOpenChange: onOpenChangeEndMatchDialog,
  } = useDisclosure();
  const {
    isOpen: isOpenDeleteMatchDialog,
    onOpen: onOpenDeleteMatchDialog,
    onOpenChange: onOpenChangeDeleteMatchDialog,
  } = useDisclosure();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const fetchData = useFetch();
  const { showAlertMessage } = useToast();

  const handleEndMatch = React.useCallback(() => {
    if (!selectedMatch) return;
    const url = ApiEndpoint.updateMatch.replace(
      ':id',
      selectedMatch?.id.toString(),
    );
    const body = JSON.stringify({ inProgress: false });
    fetchData<Match>(url, 'PATCH', { body }).then(() => {
      showAlertMessage({
        message: t('matches.messages.matchEnded'),
        type: 'success',
      });
      getAllMatches();
    });
  }, [selectedMatch]);

  const handleDeleteMatch = React.useCallback(() => {
    if (!selectedMatch) return;
    const url = ApiEndpoint.deleteMatch.replace(
      ':id',
      selectedMatch?.id.toString(),
    );
    fetchData<Match>(url, 'DELETE').then(() => {
      showAlertMessage({
        message: t('matches.messages.deleteSuccess'),
        type: 'success',
      });
      getAllMatches();
    });
  }, [selectedMatch]);

  return (
    <>
      <Card
        shadow="md"
        isPressable
        onPress={() => navigate(match.id.toString())}
        as="div"
        classNames={{
          base: 'flex-grow sm:flex-grow-0',
        }}
      >
        <CardHeader className="justify-between gap-8 pb-0">
          <span>
            {t('matches.labels.matchId')}: {match.id}
          </span>
          {match.inProgress ? (
            <Chip color="success" variant="dot">
              {t('matches.labels.inProgress')}
            </Chip>
          ) : (
            <Chip color="danger" variant="bordered">
              {t('matches.labels.ended')}
            </Chip>
          )}
        </CardHeader>
        <CardBody className="py-8">
          <AvatarGroup isBordered size="md" color="default">
            {match.users.map((player) => (
              <Tooltip
                key={player.id}
                content={`${player.firstname} ${player.lastname}`}
              >
                <Avatar
                  name={getInitialLetters(player.firstname, player.lastname)}
                />
              </Tooltip>
            ))}
          </AvatarGroup>
        </CardBody>
        <Divider />
        <CardFooter>
          <div className="w-full flex flex-col gap-0.5 items-start text-gray-400">
            <span className="text-small italic">{match.location?.name}</span>
          </div>
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly variant="light" size="sm">
                <VerticalDotsIcon />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem
                key="edit"
                onPress={() => {
                  onOpenEditMatchDialog();
                  setSelectedMatch(match);
                }}
                isDisabled={!match.inProgress}
              >
                {t('buttons.edit')}
              </DropdownItem>
              <DropdownItem
                key="end_match"
                color="warning"
                className="text-warning"
                variant="flat"
                onPress={() => {
                  onOpenEndMatchDialog();
                  setSelectedMatch(match);
                }}
                isDisabled={!match.inProgress}
              >
                {t('buttons.endMatch')}
              </DropdownItem>
              <DropdownItem
                key="delete"
                color="danger"
                className="text-danger"
                onPress={() => {
                  onOpenDeleteMatchDialog();
                  setSelectedMatch(match);
                }}
              >
                {t('buttons.delete')}
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </CardFooter>
      </Card>

      <CreateEditMatchDialog
        isOpen={isOpenEditMatchDialog}
        onOpenChange={onOpenChangeEditMatchDialog}
        match={selectedMatch}
      />
      <AlertDialog
        isOpen={isOpenEndMatchDialog}
        onOpenChange={onOpenChangeEndMatchDialog}
        contentText={t('matches.messages.askEndMatch').replace(
          '{id}',
          selectedMatch?.id.toString() ?? '',
        )}
        onConfirm={handleEndMatch}
        confirmButtonText="Confirm"
      />
      <AlertDialog
        isOpen={isOpenDeleteMatchDialog}
        onOpenChange={onOpenChangeDeleteMatchDialog}
        contentText={t('matches.messages.askDelete').replace(
          '{id}',
          selectedMatch?.id.toString() ?? '',
        )}
        onConfirm={handleDeleteMatch}
      />
    </>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export default React.memo(MatchCard);
